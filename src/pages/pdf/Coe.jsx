import React, { useState, useRef } from "react";
import pdf_format from "../../assets/certificate_template.png"; // Path to your certificate template image
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import { PDFDocument } from "pdf-lib";

function Coe() {
 const [name, setName] = useState(""); // State to store name input
    const [submittedName, setSubmittedName] = useState(""); // Store submitted name
    const certificateRef = useRef(null); // Reference to certificate div

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmittedName(name); // Set submitted name on button click
    };

    const downloadPDF = async () => {
        if (certificateRef.current) {
            const canvas = await html2canvas(certificateRef.current, { scale: 2 });
            const imgData = canvas.toDataURL("image/jpeg", 1.8);
            const imgBytes = await fetch(imgData).then(res => res.arrayBuffer());

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
                    placeholder="Enter Student Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={styles.input}
                />
                <button type="submit" style={styles.submitButton}>Submit</button>
            </form>

            <div ref={certificateRef} style={styles.certificateContainer}>
                <img src={pdf_format} alt="PDF Format" style={styles.certificateImage} />
                {submittedName && (
                    <div style={styles.certificateName}>
                        {submittedName}
                    </div>
                )}
            </div>
            <button onClick={downloadPDF} style={styles.downloadButton}>
                Download Certificate
            </button>
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
        border: "2px solid black",
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
        top: "49%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        fontWeight: "bold",
        fontSize: "24px",
        color: "black",
        fontFamily: "Arial, sans-serif",
        padding: "5px 10px",
        borderRadius: "5px",

    },
    downloadButton: {
        marginTop: "20px",
        marginBottom:"20px",
        padding: "10px",
        backgroundColor: "#0e49a8",
        color: "white",
        border: "none",
        cursor: "pointer",
    },
};

export default Coe;
