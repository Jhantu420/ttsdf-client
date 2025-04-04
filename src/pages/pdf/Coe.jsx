import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

function Coe() {
  const pdfRef = useRef();

  const downloadPDF = () => {
    const input = pdfRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('certificate.pdf');
    });
  };

  return (
    <div className='p-6'>
      {/* PDF Content */}
      <div ref={pdfRef} className='border border-red-800 p-7 bg-white'>
        <p>C.R.NO: BHA/RYCTA/083</p>
        <h1 className='text-center text-6xl font-extrabold text-blue-700'>
          BHATORA YOUTH COMPUTER TRAINING ACADEMY
        </h1>
      </div>

      {/* Download Button */}
      <button 
        onClick={downloadPDF}
        className='mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700'
      >
        Download PDF
      </button>
    </div>
  );
}

export default Coe;
