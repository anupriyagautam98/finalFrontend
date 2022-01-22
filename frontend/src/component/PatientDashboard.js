import React from "react";
import "./Dasboard.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link, Navigate, useNavigate } from "react-router-dom";
import PatientsNavbar from "./patient/PatientsNavbar";
import Scrollspy from "./patient/Scrollspy";
import PatientsDetails from "./patient/PatientsDetails";
// import ProblemDetails from "./patient/ProblemDetails";
import Prescriptions from "./patient/Prescriptions";
import { useParams } from "react-router";
import Moment from "moment";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./Footer";

const funType = (type) => {
    if (type === "1") {
      return "Active";
    } else {
      return "Intolerance";
    }
  };

  const funCrit = (Crit) => {
    if (Crit === "1") {
      return "Low";
    } else if (Crit === "2") {
      return "Medium";
    } else {
      return "High";
    }
  };

  const funVeri = (Veri) => {
    if (Veri === "1") {
      return "Suspected";
    } else if (Veri === "2") {
      return "Likely";
    } else if (Veri === "3") {
      return "Confirmed";
    } else if (Veri === "4") {
      return "Resolved";
    } else {
      return "Refuted";
    }
  };

  const funStat = (Stat) => {
    if (Stat === "1") {
      return "Active";
    } else {
      return "Resolved";
    }
  };

  const funSever = (Sever) => {
    if (Sever === "1") {
      return "Mild";
    } else if (Sever === "2") {
      return "Moderate";
    } else {
      return "Severe";
    }
  };

const PatientDashboard = () => {
  const params = useParams();
  // console.log(params)
  const [component, setComponent] = useState(1);
  const [all, setAll] = useState([]);
  const [patient, setPatient] = useState({
    Id: "",
    Name: "",
    Age: "",
    Gender: "",
    Contact: "",
    "Treatment under": "",
  });
  const [vitals, setVitals] = useState({
    Date: "",
    Height: "",
    Weight: "",
    Pulse: "",
    Temperature: "",
    "Blood Pressure": "",
  });

  const tobacco = (t) => {
    if (t === "1") {
      return "Never Smoked";
    } else if (t === "2") {
      return "Current Smoker";
    } else {
      return "Former Smoker";
    }
  };

  const alcohol = (t) => {
    if (t === "1") {
      return "Current Drinker";
    } else if (t === "2") {
      return "Former Drinker";
    } else {
      return "Non Drinker";
    }
  };

  const [medications, setMedications] = useState(null);
  const [allergy, setAllergy] = useState(null);
  const [problem, setProblem] = useState(null);
  const [social, setSocial] = useState({
    Tobacco: "",
    Alcohol: "",
  });

  const fetchPatientData = async () => {
    const id = params.id;

    const age = (dob1) => {
      var today = new Date();
      var birthDate = new Date(dob1);
      var age_now = today.getFullYear() - birthDate.getFullYear();
      var m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age_now--;
      }
      // console.log(age_now);
      return age_now;
    };


    
    try {
      const resp1 = await axios.get(`/api/patient/${id}/me`);
      setPatient({
        Id: resp1.data.id,
        Name: resp1.data.name,
        Age: age(resp1.data.dob),
        Gender: resp1.data.gender,
        Contact: resp1.data.phone_number,
        "Treatment under": resp1.data.doctor_name,
      });
    } catch (error) {
      toast("Some Error Occured!");
    }

    try {
      const resp2 = await axios.get(`/api/patient/${id}/vitals`);
      setVitals({
        "Registered Date": Moment(resp2.data.date_added).format("Do MMM YYYY"),
        "Height(cm)": resp2.data.height,
        "Weight(kg)": resp2.data.weight,
        "Pulse(bpm)": resp2.data.pulse,
        "Temperature(F)": resp2.data.temperature,
        "Blood Pressure(mmHg)": resp2.data.blood_pressure,
      });
    } catch (error) {
      toast("Some Error Occured!");
    }

    let resp3;
    try {
      resp3 = await axios.get(`/api/patient/${id}/medications`);
      setMedications(resp3.data);
    } catch (error) {
      toast("Some Error Occured!");
    }

    try {
      const resp4 = await axios.get(`/api/patient/${id}/allergy`);
      console.log(resp4.data)
      let nw1 = []
      resp4.data.map(el => {
        const data = {
          Type: funType(el.type),
          Substance: el.substance,
          Criticality: funCrit(el.criticality),
          "Verification Status":funVeri(el.verification_status),
        }
        nw1.push(data)
      })
      setAllergy(nw1)
    } catch (error) {
      toast("Some Error Occured!");
    }
    

    try {
      const resp5 = await axios.get(`/api/patient/${id}/problem`);
      // setProblem(resp5.data);
      let new1 = []
      resp5.data.map(ele => {
        const data = {
          Description: ele.problem_name,
          Severity: funSever(ele.severity)  ,
          Status: funStat(ele.status),
        }
        new1.push(data)
      })
      setProblem(new1)
    } catch (error) {
      toast("Some Error Occured!");
    }

    try {
      const resp6 = await axios.get(`/api/patient/${id}/social`);
      setSocial({
        Tobacco: tobacco(resp6.data.tobacco),
        Alcohol: alcohol(resp6.data.alcohol),
      });
    } catch (error) {
      toast("Some Error Occured!");
    }

    const fun = async (id) => {
      try {
        const { data } = await axios.get(`/api/patient/${id}/dose/`);
        return data;
      } catch (error) {
        toast("Some Error Occured!");
      }
    };
    let nw = [];
    resp3.data.map(async (el) => {
      let dta = await fun(el.id);
      let obj = {
        Medicine: el.medication_name,
        Description: dta.dose_description,
        Timing: dta.dose_timing,
        Amount: dta.dose_amount,
      };
      nw.push(obj);
      // setAll(nw)
    });
    setAll(nw);
  };

  useEffect(() => {
    fetchPatientData();
  }, []);

  return (
    <div>
      <div className="body">
        <PatientsNavbar />

        <section className="content ">
          <div className="box">
            <h1 className="mt-5 mb-5 text-center">
              Hi {patient.Name.toUpperCase()}!
            </h1>
            <div className="rounded inner-box pb-5 ">
              <Scrollspy num={setComponent} selected={component} />
              {component === 1 && (
                <PatientsDetails
                  patient={patient}
                  vitals={vitals}
                  social={social}
                  allergy={allergy}
                  problem={problem}
                />
              )}
              {component === 2 && <Prescriptions all={all} />}
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </div>
  );
};

export default PatientDashboard;
