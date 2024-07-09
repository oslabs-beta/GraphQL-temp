export function schemaGenerator(nodes, edges) {
  //create aux objects to hold node relationships for O(1) lookup
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
    manyToOneRelationships[edge.source].push(edge.target);
    oneToManyRelationships[edge.target].push(edge.source);
  });

  let gql_schema = `#graphql\n`;

  let query_string = `  type Query {\n`;

  //for each node in nodes argument
  nodes.forEach((node) => {
    //query for all elements in type (plural form)
    query_string += `    ${pluralize(node.id)}: [${pluralize
      .singular(node.id)
      .replace(/^./, node.id[0].toUpperCase())}]\n`;

    //query for one element in type (by ID - singular form)
    query_string += `    ${pluralize.singular(node.id)}(id: ID!): ${pluralize
      .singular(node.id)
      .replace(/^./, node.id[0].toUpperCase())}\n`;

    //add type to schema string
    gql_schema += `  type ${pluralize
      .singular(node.id)
      .replace(/^./, node.id[0].toUpperCase())} {\n`;
    //add id property to type
    gql_schema += '    id: ID!\n';

    //add associated columns to GraphQL type
    for (let i = 1; i < node.data.columns.length; i++) {
      //check if column is required and add column to type
      const required = node.data.columns[i].required ? '!' : '';
      gql_schema += `    ${node.data.columns[i].name}: ${node.data.columns[i].type}${required}\n`;
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

  //return final schema
  return gql_schema + query_string;
}