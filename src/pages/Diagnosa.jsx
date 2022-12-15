import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Diagnosa() {
  const [results, setResults] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const getResult = () => {
    axios.get(`http://localhost:8000/api/v1/result`).then((response) => {
      setResults(response.data.data);
    });
  };
  const getConsultation = () => {
    axios.get(`http://localhost:8000/api/v1/consultation`).then((response) => {
      setConsultations(response.data.data);
    });
  };
  useEffect(() => {
    getResult();
    getConsultation();
  }, []);

  const handleClose = () => {
    localStorage.removeItem("userId");
    navigate("/");
    window.location.reload();
  };
  return (
    <>
      <div>
        {results.map((result) => {
          if (userId == result.Client.id) {
            return (
              <div key={result.id}>
                <label>Name = {result.Client.name}</label>
                <br />
                <label>Diagnosa</label>
                <ul>
                  {consultations.map((consul) => {
                    if (userId == consul.Client.id) {
                      return <li key={consul.id}>{consul.Indication.name}</li>;
                    }
                  })}
                </ul>
                <label>Kerusakan = {result.Fault.name}</label>
              </div>
            );
          }
        })}
      </div>
      <button onClick={handleClose}>Close</button>
    </>
  );
}

export default Diagnosa;
