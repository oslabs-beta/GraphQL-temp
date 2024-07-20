import React, { useContext, useState } from 'react';
import UploadSqlSchema from '../UploadSqlSchema/UploadSqlSchema';
import AuthorizedNavbar from '../AuthorizedNavbar/AuthorizedNavbar';
import SchemaVisualizer from '../NodeSchema/SchemaVisualizer'
import { useGraphContext } from '../../contexts/GraphContext.jsx';
import '../NodeSchema/schemavisualizer.scss';

function Graph() {
  const [sqlContents, setSqlContents] = useState([]);
  const { graphName, setGraphName } = useGraphContext();
  // const { graphId, setGraphId } = useGraphContext();

  const handleUploadBtn = (content) => {
    setSqlContents([...sqlContents, content]);
  };

  return (
    <>
      <AuthorizedNavbar />
      <UploadSqlSchema />
    </>
  );
}

export default Graph;
