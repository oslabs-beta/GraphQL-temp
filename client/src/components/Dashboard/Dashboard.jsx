import React, { useContext, useState } from 'react';
import AuthorizedNavbar from '../AuthorizedNavbar/AuthorizedNavbar';
import DashboardGrid from '../DashboardGrid/DashboardGrid';
import ModalGraphName from '../ModalGraphName/ModalGraphName';
import addGraph from '../../assets/logos/addGraph.png';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import './dashboard.scss';

// Defining Dashboard Component
function Dashboard() {
  const { darkMode } = useTheme();
  const [ modalVisibility, setModalVisibility ] = useState(false);

  const handleModalOpen = (e) => {
    // e.preventDefault();
    setModalVisibility(true);
  }
  const handleModalClose = (e) => {
    // e.preventDefault();
    setModalVisibility(false);
  }
  // JSX to define Dashboard Page
  return (
    <>
      <ModalGraphName modalVisibility={modalVisibility} handleModalClose={handleModalClose}/>
      <AuthorizedNavbar />
        <div className={`dashboard-container ${darkMode ? 'dark' : ''}`}>
          <h1 className={`dashboard-title ${darkMode ? 'dark' : ''}`}>Your Saved Graphs</h1>

          <DashboardGrid handleModalOpen={handleModalOpen} handleModalClose={handleModalClose}/>

        {/* <div className="add-graph-section">
            <button className="add-graph-button" onClick={handleModalOpen}>
              <img src={addGraph} alt="Add Graph" />
            </button>
            <p>Click here to create a new project</p>
          </div>
        </div> */}
      </div>
    </>
  );
}

export default Dashboard;
