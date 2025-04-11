import React, { useState, useRef } from "react";
import pdf_format from "../../assets/certificate_template.png";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import { PDFDocument } from "pdf-lib";
import { useAuth } from "../../context/AppContext";
import axios from "axios";
function Coe() {
  const [userId, setUserId] = useState(""); // Registration number
  const [userData, setUserData] = useState(null); // Full user object
  const certificateRef = useRef(null);
  const { url } = useAuth(); // Base URL from context
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${url}/api/v1/get-user-by-id`,
        { userId },
        { withCredentials: true }
      );
      if (response.data?.success) {
        setUserData(response.data.data); // Save full user data
      } else {
        alert(response.data?.message || "User not found.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert(
        error.response?.data?.message ||
          "Something went wrong while fetching user."
      );
    }
  };
  const downloadPDF = async () => {
    if (certificateRef.current) {
      const canvas = await html2canvas(certificateRef.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/jpeg", 1.8);
      const imgBytes = await fetch(imgData).then((res) => res.arrayBuffer());
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([canvas.width, canvas.height]);
      const img = await pdfDoc.embedJpg(imgBytes);
      page.drawImage(img, {
        x: 0,
        y: 0,
        width: page.getWidth(),
        height: page.getHeight(),
      });
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      saveAs(blob, "certificate.pdf");
    }
  };
  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Enter Registration Number"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.submitButton}>
          Submit
        </button>
      </form>
      <div ref={certificateRef} style={styles.certificateContainer}>
        <img
          src={pdf_format}
          alt="PDF Format"
          style={styles.certificateImage}
        />
        {userData && (
          <>
            <div style={styles.certificateName}>{userData.name}</div>
            <div style={styles.fatherName}>{userData.fathername}</div>
            <div style={styles.courseName}>{userData.courseName}</div>
            <div style={styles.branchName}>{userData.branchName}</div>
            <div style={styles.userId}>{userData.userId}</div>
            <div style={styles.duration}>
              {userData.courseDuration?.split(" ")[0]}
            </div>
            <div style={styles.month1}>{userData.dor}</div>
            <div style={styles.month2}>
              {(() => {
                const durationInMonths = parseInt(
                  userData.courseDuration?.split(" ")[0]
                );
                const startDate = new Date(userData.dor);
                const endDate = new Date(
                  startDate.setMonth(startDate.getMonth() + durationInMonths)
                );
                return endDate.toISOString().split("T")[0]; // Format: YYYY-MM-DD
              })()}
            </div>
            <div style={styles.grade}>{userData.grade}</div>
            <div style={styles.issueDate}>
              {new Date().toLocaleDateString("en-CA")}
            </div>
          </>
        )}
      </div>
      {userData && (
        <button onClick={downloadPDF} style={styles.downloadButton}>
          Download Certificate
        </button>
      )}
    </div>
  );
}
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    flexDirection: "column",
    padding: "10px",
    boxSizing: "border-box",
  },
  form: {
    marginBottom: "20px",
    width: "100%",
    maxWidth: "400px",
  },
  input: {
    width: "100%",
    padding: "10px",
    boxSizing: "border-box",
  },
  submitButton: {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    backgroundColor: "#0e49a8",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
  certificateContainer: {
    position: "relative",
    display: "inline-block",
    background: "lightblue",
    padding: "10px",
    width: "50%",
    boxSizing: "border-box",
  },
  certificateImage: {
    width: "100%",
    height: "auto",
  },
  certificateName: {
    position: "absolute",
    top: "37%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontWeight: "bold",
    fontSize: "12px",
    color: "black",
    fontFamily: "Arial, sans-serif",
  },
  fatherName: {
    position: "absolute",
    top: "43%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontWeight: "bold",
    fontSize: "12px",
    color: "black",
    fontFamily: "Arial, sans-serif",
  },
  courseName: {
    position: "absolute",
    top: "49%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontWeight: "bold",
    fontSize: "12px",
    color: "black",
    fontFamily: "Arial, sans-serif",
  },
  branchName: {
    position: "absolute",
    top: "54%",
    left: "55%",
    transform: "translate(-24%, -50%)",
    fontWeight: "bold",
    fontSize: "10px",
    color: "black",
    fontFamily: "Arial, sans-serif",
  },
  userId: {
    position: "absolute",
    top: "66%",
    left: "49%",
    transform: "translate(-22%, -50%)",
    fontWeight: "bold",
    fontSize: "10px",
    color: "black",
    fontFamily: "Arial, sans-serif",
  },
  issueDate: {
    position: "absolute",
    top: "66%",
    left: "79%",
    transform: "translate(-22%, -50%)",
    fontWeight: "bold",
    fontSize: "10px",
    color: "black",
    fontFamily: "Arial, sans-serif",
  },
  grade: {
    position: "absolute",
    top: "66%",
    left: "19%",
    transform: "translate(-22%, -50%)",
    fontWeight: "bold",
    fontSize: "10px",
    color: "black",
    fontFamily: "Arial, sans-serif",
  },
  duration: {
    position: "absolute",
    top: "61%",
    left: "25%",
    transform: "translate(-22%, -50%)",
    fontWeight: "bold",
    fontSize: "10px",
    color: "black",
    fontFamily: "Arial, sans-serif",
  },
  month1: {
    position: "absolute",
    top: "61%",
    left: "57%",
    transform: "translate(-22%, -50%)",
    fontWeight: "bold",
    fontSize: "10px",
    color: "black",
    fontFamily: "Arial, sans-serif",
  },
  month2: {
    position: "absolute",
    top: "61%",
    left: "73%",
    transform: "translate(-22%, -50%)",
    fontWeight: "bold",
    fontSize: "10px",
    color: "black",
    fontFamily: "Arial, sans-serif",
  },
  downloadButton: {
    marginTop: "20px",
    marginBottom: "20px",
    padding: "10px",
    backgroundColor: "#0e49a8",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
};

export default Coe;
