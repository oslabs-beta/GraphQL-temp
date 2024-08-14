const pluralize = require('pluralize');

//parseSqlSchema function parses pg_dump file and returns nodes and edges objects for file generation and display
export function parseSqlSchema(sql) {
  //declare objects to hold tables and relationships
  const tables = {};
  let currentTable;
  const relationships = [];
  let index = 0;

  //moreFields handles adding fields to GQL types
  let moreFields = false;
  //create mapping object to change SQL types to GQL types
  const typeMapper = {
    varchar: 'String',
    serial: 'ID',
    bigint: 'Int',
    DATE: 'String',
    integer: 'Int',
    character: 'String',
  };
  try {
    // Split dump file and parse line by line
    const lineArray = sql.split(/\r?\n/);

    lineArray.forEach((line) => {
      // 'CREATE TABLE public' lines denote beginning of SQL table information
      if (line.startsWith('CREATE TABLE public')) {
        // Grab table name
        let tableName = line.match(/CREATE TABLE (\w+\.)?(\w+)/)[2];
        currentTable = tableName;
        // Add tableName to tables object and assign template object to hold associated fields
        tables[currentTable] = { primaryKey: '', fields: [] };
        moreFields = true;
      } else if (moreFields) {
        //if all fields have been added to table, set moreFields to false
        if (line.startsWith(')')) {
          moreFields = false;
          //while table still has more fields to add, continue adding
        } else {
          // Add each field to current table
          const lineArray = line.trim().split(' ');
          // Make sure field is valid
          if (lineArray.length >= 2) {
            const fieldName = lineArray[0].replace(/"/g, '');
            //make sure field is not a primary key definition
            if (fieldName !== 'CONSTRAINT') {
              //remove trailing commas from non-null (required) fields to check if required
              const fieldType = typeMapper[lineArray[1].replace(/,/g, '')];
              const required = line.toLowerCase().includes('not null');
              // Add new field object to associated fields array on table object
              tables[currentTable].fields.push({
                name: fieldName,
                type: fieldType,
                required: required,
                isForeignKey: '',
              });
            }
            //if line is primary key definition, assign primary key to current node
            else {
              const match = line.match(/PRIMARY KEY \("?([^")]+)"?\)/);
              tables[currentTable].primaryKey = match[1];
            }
          }
        }
      }
      // Grab relationships from alter tables (primary/foreign keys)
      else if (line.startsWith('ALTER TABLE')) {
        //standardize input
        line = line
          .replace('ALTER TABLE ONLY', 'ALTER TABLE')
          .replace(/"/g, '');
        //only use public tables to link relationships
        if (line.startsWith('ALTER TABLE public')) {
          //if line has been split into two lines on import, concatenate them
          if (line.at(line.length - 1) !== ';') {
            //add next line to current
            line += lineArray[index + 1];
          }
          //attempt to match line to relationship template
          const matchRelationship = line.match(
            /ALTER TABLE (\w+\.)?(\w+).*FOREIGN KEY \((\w+)\) REFERENCES (\w+\.)?(\w+)\((\w+)\)/
          );
          //attempt to match line to primary key template
          const matchPrimaryKey = line.match(
            /ALTER TABLE (\w+\.)?(\w+).*PRIMARY KEY \((\w+)\)/
          );
          //if line matches, store data
          if (matchRelationship) {
            const [
              ,
              sourceCheck,
              sourceTable,
              sourceField,
              targetCheck,
              targetTable,
              targetField,
            ] = matchRelationship;

            //change foreign key property on source field
            tables[sourceTable].fields.forEach((field) => {
              if (field.name === sourceField)
                field.isForeignKey = targetTable + '.' + targetField;
            });

            //if both tables are public, push data onto relationships object
            if (sourceCheck === 'public.' && targetCheck === 'public.') {
              relationships.push({
                source: sourceTable,
                sourceHandle: sourceField,
                target: targetTable,
                targetHandle: targetField,
              });
            }
            //if line matches primary key template, assign primary key to current table
          } else if (matchPrimaryKey) {
            const [, tableCheck, tableName, pkField] = matchPrimaryKey;

            if (tableCheck === 'public.') {
              tables[tableName].primaryKey = pkField;
            }
          }
        }
      }
      index++;
    });

    // Calculate grid layout from created nodes
    const gridLayout = (nodes, columns = 3, width = 250, height = 300) => {
      return nodes.map((node, index) => {
        const column = index % columns;
        const row = Math.floor(index / columns);
        return {
          ...node,
          position: {
            x: column * width,
            y: row * height,
          },
        };
      });
    };

    // Create nodes for React Flow display from tables object parsed from pg_dump file
    const nodes = gridLayout(
      Object.entries(tables).map(([tableName, columns]) => ({
        id: pluralize
          .singular(tableName)
          .replace(/^./, tableName[0].toUpperCase()),
        type: 'table',
        dbTableName: tableName,
        primaryKey: columns.primaryKey,
        data: {
          label: pluralize
            .singular(tableName)
            .replace(/^./, tableName[0].toUpperCase()),
          columns: columns,
        },
      }))
    );

    // Create edges for React Flow display from relationships object parsed from pg_dump file
    const edges = relationships.map((rel) => ({
      id: crypto.randomUUID(),
      source: pluralize
        .singular(rel.source)
        .replace(/^./, rel.source[0].toUpperCase()),
      sourceHandle: rel.sourceHandle,
      dbSourceTable: rel.source,
      target: pluralize
        .singular(rel.target)
        .replace(/^./, rel.target[0].toUpperCase()),
      targetHandle: rel.targetHandle,
      dbTargetTable: rel.target,
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#fff' },
    }));

    return { nodes, edges };
  } catch (err) {
    const nodes = {};
    const edges = {};
    console.log('Unable to parse file');
    alert('Unable to parse file');
    return { nodes, edges };
  }
}
