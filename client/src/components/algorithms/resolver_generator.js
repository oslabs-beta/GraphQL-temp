import pluralize from 'pluralize';


//resolverGenerator function generates GraphQL resolver functions from current nodes and edges objects
export default function resolverGenerator(nodes, edges) {
  //create aux objects to hold node relationships
  const oneToManyRelationships = {};
  const manyToOneRelationships = {};

  //loop through edges and add to relationship aux objects
  edges.forEach((edge) => {
    //if source node has no connections, create empty array to hold them
    if (manyToOneRelationships[edge.source] === undefined) {
      manyToOneRelationships[edge.source] = [];
    }
    //if target node has no connections, create empty array to hold them
    if (oneToManyRelationships[edge.target] === undefined) {
      oneToManyRelationships[edge.target] = [];
    }
    //push each connection onto aux objects
    manyToOneRelationships[edge.source].push({
      targetNode: edge.target,
      targetField: edge.targetHandle,
      sourceField: edge.sourceHandle,
      dbTargetTable: edge.dbTargetTable,
    });
    oneToManyRelationships[edge.target].push({
      targetNode: edge.source,
      targetField: edge.sourceHandle,
      sourceField: edge.targetHandle,
      dbTargetTable: edge.dbSourceTable,
    });
  });
  //begin template resolver string
  let resolverString = `const resolvers = {\n  Query: {\n`;

  //add resolvers for each GraphQL Object Type
  nodes.forEach((node) => {
    //add '_all' if plural form of word is same as singular form (species -> species_all)
    const pluralIsSingular =
      pluralize(node.id) === pluralize.singular(node.id) ? '_all' : '';
    //add entry point for whole table
    resolverString += `    ${pluralize(node.id).replace(
      /^./,
      node.id[0].toLowerCase()
    )}${pluralIsSingular}() {\n      return db.query('SELECT * FROM ${
      node.dbTableName
    }').then((data) => data.rows);\n    },\n`;

    //select primary key field for resolver queries
    const primaryKeyField = node.data.columns.fields.filter(
      (field) => field.name === node.primaryKey
    );
    //add entry point for single element (by primary key)
    resolverString += `    ${pluralize
      .singular(node.id)
      .replace(
        /^./,
        node.id[0].toLowerCase()
      )}(_, args) {\n      return db.query(\`SELECT * FROM ${
      node.dbTableName
    } WHERE ${primaryKeyField[0].name} = '\${args.${
      primaryKeyField[0].name
    }}'\`).then((data) => data.rows[0]);\n    },\n`;
  });
  //close off GraphQL Object Type string
  resolverString += '  },\n';
  //add nested relationships to resolver string
  nodes.forEach((node) => {
    if (
      manyToOneRelationships[node.id] !== undefined ||
      oneToManyRelationships[node.id] !== undefined
    ) {
      //grab primary key for table
      const primaryKeyField = node.data.columns.fields.filter(
        (field) => field.name === node.primaryKey
      );
      //add connection for each type if they exists
      resolverString += `  ${node.id}:  {\n`;
      
      //add many to one relationships for current node
      if (manyToOneRelationships[node.id] !== undefined) {
        manyToOneRelationships[node.id].forEach((connection) => {
          resolverString += `    ${connection.targetNode.replace(
            /^./,
            connection.targetNode[0].toLowerCase()
          )}(parent) {\n`;
          resolverString += `      return db.query(\`SELECT ${connection.dbTargetTable}.* FROM ${connection.dbTargetTable} JOIN ${node.dbTableName} ON ${node.dbTableName}.${connection.sourceField} = ${connection.dbTargetTable}.${connection.targetField} WHERE ${node.dbTableName}.${primaryKeyField[0].name} = '\${parent.${primaryKeyField[0].name}}'\`).then((data) => data.rows[0]);\n    },\n`;
        });
      }
      //add one to many relationships for current node
      if (oneToManyRelationships[node.id] !== undefined) {
        oneToManyRelationships[node.id].forEach((connection) => {
          resolverString += `    ${pluralize(connection.targetNode).replace(
            /^./,
            connection.targetNode[0].toLowerCase()
          )}(parent) {\n`;
          resolverString += `      return db.query(\`SELECT ${connection.dbTargetTable}.* FROM ${connection.dbTargetTable} JOIN ${node.dbTableName} ON ${node.dbTableName}.${connection.sourceField} = ${connection.dbTargetTable}.${connection.targetField} WHERE ${node.dbTableName}.${primaryKeyField[0].name} = '\${parent.${primaryKeyField[0].name}}'\`).then((data) => data.rows);\n    },\n`;
        });
      }
      resolverString += `  },\n`;
    }
  });
  resolverString += '}\n';
  
  //output final resolver string as array for display and copying
  const resolverArray = resolverString.split('\n');
  return resolverArray;
}
