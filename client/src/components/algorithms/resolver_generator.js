import pluralize from 'pluralize';

export default function resolverGenerator(nodes, edges) {
  //create aux objects to hold node relationships
  const oneToManyRelationships = {};
  const manyToOneRelationships = {};
  //for each edge between nodes
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
  console.log(oneToManyRelationships);
  let resolverString = `const resolvers = {\n  Query: {\n`;
  //add resolvers for each GraphQL Object Type
  nodes.forEach((node) => {
    //add all if plural form of work is same as singular form (species -> species_all)
    const pluralIsSingular =
      pluralize(node.id) === pluralize.singular(node.id) ? '_all' : '';
    //add entry point for whole table
    resolverString += `    ${pluralize(node.id).replace(
      /^./,
      node.id[0].toLowerCase()
    )}${pluralIsSingular}() {\n      return db.query('SELECT * FROM ${
      node.dbTableName
    }').then((data) => data.rows);\n    },\n`;
    //grab primary key field for resolver queries
    const primaryKeyField = node.data.columns.fields.filter(
      (field) => field.name === node.primaryKey
    );
    // //add entry point for single element (by primary key)
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
      //move outside for plural
      resolverString += `  ${node.id}:  {\n`;
      //for each connection
      if (manyToOneRelationships[node.id] !== undefined) {
        manyToOneRelationships[node.id].forEach((connection) => {
          resolverString += `    ${connection.targetNode.replace(
            /^./,
            connection.targetNode[0].toLowerCase()
          )}(parent) {\n`;
          resolverString += `      return db.query(\`SELECT ${connection.dbTargetTable}.* FROM ${connection.dbTargetTable} JOIN ${node.dbTableName} ON ${node.dbTableName}.${connection.sourceField} = ${connection.dbTargetTable}.${connection.targetField} WHERE ${node.dbTableName}.${primaryKeyField[0].name} = '\${parent.${primaryKeyField[0].name}}'\`).then((data) => data.rows[0]);\n    },\n`;
        });
      }
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
  const resolverArray = resolverString.split('\n');
  return resolverArray;
}
