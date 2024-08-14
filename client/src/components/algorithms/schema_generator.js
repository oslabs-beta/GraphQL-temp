import pluralize from 'pluralize';

//schemaGenerator function generates GraphQL typeDefs from current nodes and edges objects
export default function schemaGenerator(nodes, edges) {
  if (!nodes) {
    return 'No data available to generate schema.';
  }
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
    //push each connection onto aux objects (node to node)
    manyToOneRelationships[edge.source].push(edge.target);
    oneToManyRelationships[edge.target].push(edge.source);
  });

  let gql_schema = `#graphql\n`;

  let query_string = `  type Query {\n`;

  //for each node in current nodes object
  nodes.forEach((node) => {
    //select primary key field for query by primary key
    const primaryKeyField = node.data.columns.fields.filter(
      (field) => field.name === node.primaryKey
    );
    //if plural/singular versions of id are the same, add 'All' to plural version
    const pluralIsSingular =
      pluralize(node.id) === pluralize.singular(node.id) ? '_all' : '';
    //query for all elements in type (plural form)
    query_string += `    ${pluralize(node.id).replace(
      /^./,
      node.id[0].toLowerCase()
    )}${pluralIsSingular}: [${pluralize
      .singular(node.id)
      .replace(/^./, node.id[0].toUpperCase())}]\n`;

    //query for one element in type (by primary key - singular form)
    const required = primaryKeyField[0].required ? '!' : '';
    query_string += `    ${pluralize
      .singular(node.id)
      .replace(/^./, node.id[0].toLowerCase())}(${primaryKeyField[0].name}: ${
      primaryKeyField[0].type
    }${required}): ${pluralize
      .singular(node.id)
      .replace(/^./, node.id[0].toUpperCase())}\n`;

    //add type to schema string
    gql_schema += `  type ${pluralize
      .singular(node.id)
      .replace(/^./, node.id[0].toUpperCase())} {\n`;

    //add associated columns to GraphQL type
    for (let i = 0; i < node.data.columns.fields.length; i++) {
      //check if field is required
      const required = node.data.columns.fields[i].required ? '!' : '';
      gql_schema += `    ${node.data.columns.fields[i].name}: ${node.data.columns.fields[i].type}${required}\n`;
    }

    //add current type's many to one relationships to schema
    if (manyToOneRelationships[node.id]) {
      manyToOneRelationships[node.id].forEach((connection) => {
        gql_schema += `    ${connection.replace(
          /^./,
          connection[0].toLowerCase()
        )}: ${connection}!\n`;
      });
    }
    //add current type's one to many relationships to schema
    if (oneToManyRelationships[node.id]) {
      oneToManyRelationships[node.id].forEach((connection) => {
        gql_schema += `    ${pluralize(connection).replace(
          /^./,
          connection[0].toLowerCase()
        )}: [${connection}!]\n`;
      });
    }
    //close open brackets
    gql_schema += `  }\n`;
  });
  query_string += `  }\n`;
  
  //add query string to base schema and output as array for display and copying
  gql_schema += query_string;
  const testSchema = gql_schema.split('\n');
  return testSchema;
}
