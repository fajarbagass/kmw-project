import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";

function Home() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [car, setCar] = useState("");
  const [carYear, setCarYear] = useState(0);
  const [numberPlat, setNumberPlat] = useState("");
  const [status, setStatus] = useState(false);
  const [indications, setIndications] = useState([]);
  const [check, setCheck] = useState("");
  const [condition, setCondition] = useState(0);
  const [fault, setfault] = useState(0);
  const [consultations, setConsultations] = useState([]);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const indicationId = localStorage.getItem("indicationId");

  const submitClient = () => {
    const data = {
      name: name,
      category: category,
      car: car,
      car_year: carYear,
      number_plat: numberPlat,
    };
    axios
      .post(`http://localhost:8000/api/v1/client/create`, data)
      .then((response) => {
        localStorage.setItem("userId", response.data.data.id);
        window.location.reload();
      });
  };

  const submitConsultation = () => {
    if (condition == 0) {
      let data = {};
      // looping untuk menampilkan hasil jika gejala tidak ada
      consultations.forEach((consul) => {
        if (consul.Client?.id == userId) {
          // pencocokan diagnosa dengan basis pengetahuan
          const indication = consul.Indication?.code;
          if (indication == "G001") {
            data = {
              client_id: userId,
              fault_id: 1,
            };
          }
        } else {
          swal({
            title: "Penting!",
            text: "Pilih Gejala Awal Anda!",
            icon: "warning",
            button: "Oke",
          });
        }
      });

      axios
        .post(`http://localhost:8000/api/v1/result/create`, data)
        .then(() => {
          localStorage.removeItem("indicationId");
          setTimeout(() => {
            navigate("/diagnosa");
          }, 1000);
          swal("Diagnosa anda telah selesai!", {
            icon: "success",
          });
        });
    } else {
      if (fault != 0) {
        const data1 = {
          client_id: userId,
          indication_id: check,
        };
        axios
          .post(`http://localhost:8000/api/v1/consultation/create`, data1)
          .then(() => {
            localStorage.setItem("indicationId", check);
            const data2 = {
              client_id: userId,
              fault_id: fault,
            };
            axios
              .post(`http://localhost:8000/api/v1/result/create`, data2)
              .then(() => {
                localStorage.removeItem("indicationId");
                setTimeout(() => {
                  navigate("/diagnosa");
                }, 1000);
                swal("Diagnosa anda telah selesai!", {
                  icon: "success",
                });
              });
          });
      } else {
        const data1 = {
          client_id: userId,
          indication_id: check,
        };
        axios
          .post(`http://localhost:8000/api/v1/consultation/create`, data1)
          .then(() => {
            localStorage.setItem("indicationId", check);
            window.location.reload();
          });
      }
    }
  };

  const getIndication = () => {
    axios.get(`http://localhost:8000/api/v1/indication`).then((response) => {
      setIndications(response.data.data);
    });
  };
  const getConsultation = () => {
    axios.get(`http://localhost:8000/api/v1/consultation`).then((response) => {
      setConsultations(response.data.data);
    });
  };

  const removeUserId = () => {
    localStorage.removeItem("userId");
    window.location.reload();
  };
  const removeCheck = () => {
    localStorage.removeItem("indicationId");
    window.location.reload();
  };

  useEffect(() => {
    userId ? setStatus(true) : setStatus(false);
    getIndication();
    getConsultation();
  }, [userId, indicationId, check]);

  return (
    <>
      {!status ? (
        <>
          <div className="d-flex flex-column justify-content-center align-items-center">
            <h1>Form Client</h1>
          </div>
          <Container className="mt-5 py-5">
            <Form onSubmit={submitClient}>
              <Form.Group className="mt-4 mb-2">
                <Form.Label>Nama</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nama"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mt-4 mb-2">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mt-4 mb-2">
                <Form.Label>Car</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Car"
                  value={car}
                  onChange={(e) => setCar(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mt-4 mb-2">
                <Form.Label>Car Year</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="car year"
                  value={carYear}
                  onChange={(e) => setCarYear(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mt-4 mb-2">
                <Form.Label>Number Plat</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Number Plat"
                  value={numberPlat}
                  onChange={(e) => setNumberPlat(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group>
                <Row>
                  <Col>
                    <Button className="mt-2 mb-4" onClick={() => navigate(-1)}>
                      Cancel
                    </Button>
                  </Col>
                  <Col>
                    <Button className="mt-2 mb-4" type="submit">
                      Submit
                    </Button>
                  </Col>
                </Row>
              </Form.Group>
            </Form>
          </Container>
        </>
      ) : (
        <>
          <Container>
            <h1>Diagnosa</h1>
            <div className="d-flex flex-column">
              {indications.map((indication) => {
                if (indicationId === null) {
                  if (
                    indication.code === "G001" ||
                    indication.code === "G002"
                  ) {
                    return (
                      <div key={indication.id}>
                        <label>{indication.name}</label>
                        <input
                          type="checkbox"
                          value={indication.id}
                          checked={check == indication.id}
                          onChange={(e) => {
                            const selected = e.target.value;
                            if (selected == 1) {
                              setCheck(selected);
                              setCondition(selected);
                            }
                            if (selected == 2) {
                              setCheck(selected);
                              setCondition(selected);
                              setfault(2);
                            }
                          }}
                        />
                      </div>
                    );
                  }
                } else if (indicationId == 1) {
                  if (indication.code === "G003") {
                    return (
                      <div key={indication.id}>
                        <label>{indication.name}</label>
                        <input
                          type="checkbox"
                          value={indication.id}
                          checked={check == indication.id}
                          onChange={(e) => {
                            const selected = e.target.value;
                            if (selected == 3) {
                              setCheck(selected);
                              setCondition(selected);
                              setfault(2);
                            }
                          }}
                        />
                      </div>
                    );
                  }
                }
              })}
              <div>
                <label>Tidak ada pilihan</label>
                <input
                  type="checkbox"
                  value={0}
                  checked={check == 0}
                  onChange={(e) => {
                    setCondition(0);
                    setCheck(e.target.value);
                  }}
                />
              </div>
              <button type="submit" onClick={submitConsultation}>
                submit
              </button>
            </div>

            <button onClick={removeUserId}>Back</button>
            <button onClick={removeCheck}>Remove Check</button>
          </Container>
        </>
      )}
    </>
  );
}

export default Home;
