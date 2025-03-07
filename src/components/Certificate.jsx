// import React, { useRef, useState, useEffect } from "react";
// import { toPng } from "html-to-image";
// import { useLocation } from "react-router-dom"; // Import useLocation
// //import "../componentscss/certificate.css";

// function Certificate() {
//   const location = useLocation(); // Access the passed state here
//   const studentData = location.state?.studentData;
//   const certificateRef = useRef(null);
//   const [certificateUrl, setCertificateUrl] = useState(null);

//   const handleGenerateCertificate = async () => {
//     if (!certificateRef.current) return;

//     try {
//       // Generate PNG image from the certificate div
//       const image = await toPng(certificateRef.current);

//       // Send image to the backend to save and get the URL
//       const response = await fetch("/api/save-certificate", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ image }),
//       });

//       if (!response.ok) {
//         throw new Error("Error saving certificate");
//       }

//       const { certificateUrl } = await response.json();
//       setCertificateUrl(certificateUrl);
//       alert("Certificate generated! You can access it here: " + certificateUrl);
//     } catch (error) {
//       console.error("Error generating certificate:", error);
//       alert("Failed to generate certificate. Please try again.");
//     }
//   };

//   return (
//     <div>
//       {/* Certificate content */}
//       <div ref={certificateRef} className="certificate">
//         <div className="certificateBorder">
//           <h1 className="certificateTitle">Certificate of Completion</h1>
//           <p className="certificateContent">This is to certify that</p>
//           <h2 className="studentName">{studentData?.name || "Student Name"}</h2>
//           <p className="certificateContent">has successfully completed the course</p>
//           <h2 className="courseName">{studentData?.courseName || "Course Name"}</h2>
//           <p className="certificateContent">
//             on {studentData?.completionDate || "Completion Date"}
//           </p>
//           <div className="signatureSection">
//             <div className="signature">
//               <p>Instructor</p>
//               <span>____________________</span>
//             </div>
//             <div className="signature">
//               <p>Administrator</p>
//               <span>____________________</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Generate Certificate Button */}
//       <button onClick={handleGenerateCertificate} className="generateButton">
//         Generate Certificate
//       </button>

//       {/* Display the generated certificate URL */}
//       {certificateUrl && (
//         <div>
//           <p>Certificate URL:</p>
//           <a href={certificateUrl} target="_blank" rel="noopener noreferrer">
//             {certificateUrl}
//           </a>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Certificate;
import React, { useRef, useState, useEffect } from "react";
import { toPng } from "html-to-image";
import { useLocation } from "react-router-dom"; // Import useLocation
import "../componentscss/certificate.css";


function Certificate() {
  const location = useLocation(); // Access the passed state here
  const studentData = location.state?.studentData;
  const certificateRef = useRef(null);
  const [certificateUrl, setCertificateUrl] = useState(null);


  const handleGenerateCertificate = async () => {
    if (!certificateRef.current) return;


    try {
      // Generate PNG image from the certificate div
      const image = await toPng(certificateRef.current);


      // Send image to the backend to save and get the URL
      const response = await fetch("/api/save-certificate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image }),
      });


      if (!response.ok) {
        throw new Error("Error saving certificate");
      }


      const { certificateUrl } = await response.json();
      setCertificateUrl(certificateUrl);
      alert("Certificate generated! You can access it here: " + certificateUrl);
    } catch (error) {
      console.error("Error generating certificate:", error);
      alert("Failed to generate certificate. Please try again.");
    }
  };


  return (
    <div>
      {/* Certificate content */}
      <div ref={certificateRef} className="certificate">
        <div className="certificateBorder">
          <h1 className="certificateTitle">Certificate of Completion</h1>
          <p className="certificateContent">This is to certify that</p>
          <h2 className="studentName">{studentData?.name || "Student Name"}</h2>
          <p className="certificateContent">has successfully completed the course</p>
          <h2 className="courseName">{studentData?.courseName || "Course Name"}</h2>
          <p className="certificateContent">
            on {studentData?.completionDate || "Completion Date"}
          </p>
          {/* <div className="signatureSection">
            <div className="signature">
              <p>Instructor</p>
              <span>______________</span>
            </div>
            <div className="signature">
              <p>Administrator</p>
              <span>______________</span>
            </div>
          </div> */}
        </div>
      </div>


      {/* Generate Certificate Button */}
      <button onClick={handleGenerateCertificate} className="generateButton">
        Generate Certificate
      </button>


      {/* Display the generated certificate URL */}
      {certificateUrl && (
        <div>
          <p>Certificate URL:</p>
          <a href={certificateUrl} target="_blank" rel="noopener noreferrer">
            {certificateUrl}
          </a>
        </div>
      )}
    </div>
  );
}


export default Certificate;


