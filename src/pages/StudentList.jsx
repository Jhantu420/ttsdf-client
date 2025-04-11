import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiEdit, FiTrash } from "react-icons/fi";
import { useAuth } from "../context/AppContext";
import { toast, ToastContainer } from "react-toastify";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [otp, setOtp] = useState("");
  const [registeredEmail, setRegisteredEmail] = useState("");
  const { url } = useAuth();

  const calculateGrade = (marks) => {
    if (marks >= 90) return "A+";
    if (marks >= 80) return "A";
    if (marks >= 70) return "B+";
    if (marks >= 60) return "B";
    if (marks >= 50) return "C";
    if (marks >= 40) return "D";
    return "Fail";
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(`${url}/api/v1/get-all-users`, {
          withCredentials: true,
        });
        setStudents(response.data.data);
        setFilteredStudents(response.data.data);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [url]);

  // set the registered email to verify the otp

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredStudents(
      students.filter((student) =>
        [student.name, student.email, student.mobile].some((field) =>
          field.toLowerCase().includes(query)
        )
      )
    );
  };

  const handleUpdate = (student) => {
    setRegisteredEmail(student.email);
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;

    // If marks field, convert to number and calculate grade
    if (name === "marks") {
      const marks = parseFloat(value);
      updatedValue = isNaN(marks) ? "" : marks;
      const grade = isNaN(marks) ? "" : calculateGrade(marks);
      setSelectedStudent((prev) => ({
        ...prev,
        [name]: updatedValue,
        grade: grade,
      }));
      return;
    }

    setSelectedStudent((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));
  };

  const handleSave = async () => {
    try {
      await axios.put(
        `${url}/api/v1/update-user/${selectedStudent._id}`,
        selectedStudent,
        {
          withCredentials: true,
        }
      );

      // Fetch the latest data to update the state
      const response = await axios.get(`${url}/api/v1/get-all-users`, {
        withCredentials: true,
      });
      setStudents(response.data.data); // Set updated student list
      setFilteredStudents(response.data.data);
      setIsModalOpen(false);
    } catch (error) {
      alert("Failed to update student!");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?"))
      return;
    try {
      await axios.delete(`${url}/api/v1/delete-user/${id}`, {
        withCredentials: true,
      });
      setStudents(students.filter((student) => student._id !== id));
      setFilteredStudents(
        filteredStudents.filter((student) => student._id !== id)
      );
    } catch (error) {
      alert("Failed to delete student!");
    }
  };
  const handleVerifyOtp = async () => {
    try {
      const res = await axios.post(`${url}/api/v1/verifyOtp`, {
        email: registeredEmail,
        otp,
      });
      toast.success(res.data.message);
      toast.error(res.data.error);
      setOtp("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP.");
    }
  };
  return (
    <div className=" flex flex-col items-center ">
      <ToastContainer />
      <h2 className="text-2xl md:text-3xl font-semibold text-center mb-4 text-gray-800">
        Student List
      </h2>

      <input
        type="text"
        placeholder="Search by name, email, or mobile"
        value={searchQuery}
        onChange={handleSearch}
        className="w-full max-w-lg p-2 mb-4 border border-gray-900 rounded-md bg-gray-200"
      />
      {students.length > 0 ? (
        <div className="flex gap-2 bg-purple-800 text-white md:px-10 md:py-8  p-4 rounded-xl shadow-md mb-3">
          <span className="md:text-2xl font-semibold">Total Students:</span>
          <span className="md:text-2xl font-bold">{students.length}</span>
        </div>
      ) : (
        <p className="text-red-600">No students found.....</p>
      )}

      <div
        className="rounded-lg overflow-x-auto overflow-y-auto 
                h-[100vh] grid grid-cols-1 gap-4 p-4 bg-gray-100"
      >
        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : (
          <>
            {/* Mobile View (Cards) */}
            <div className="lg:hidden grid grid-cols-1 gap-4 p-4 bg-gray-500 rounded-4xl">
              {filteredStudents.map((student) => (
                <div
                  key={student._id}
                  className="border rounded-xl shadow-lg bg-white p-4 transition hover:shadow-xl"
                >
                  {/* Student Image */}
                  {student.image && (
                    <img
                      src={student.image}
                      alt={student.name}
                      className="w-28 h-28 object-cover rounded-full mx-auto border border-gray-300 shadow-sm"
                    />
                  )}

                  {/* Student Info */}
                  <div className="text-center mt-3">
                    <p className="text-lg font-semibold">{student.name}</p>
                    <p className="text-sm text-gray-600">{student.email}</p>
                  </div>

                  {/* Additional Info */}
                  <div className="mt-3 space-y-1 text-sm text-gray-700">
                    <p>
                      <strong>ID:</strong> {student.userId}
                    </p>
                    <p>
                      <strong>Mobile:</strong> {student.mobile}
                    </p>
                    <p>
                      <strong>Father's Name:</strong> {student.fathername}
                    </p>
                    <p>
                      <strong>Address:</strong> {student.address}
                    </p>
                    <p>
                      <strong>Registered On:</strong> {student.dor}
                    </p>
                    <p>
                      <strong>Branch:</strong> {student.branchName}
                    </p>
                    <p>
                      <strong>Course:</strong> {student.courseName}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          student.activeStatus
                            ? "bg-green-200 text-green-800"
                            : "bg-red-200 text-red-800"
                        }`}
                      >
                        {student.activeStatus ? "Active" : "Inactive"}
                      </span>
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between items-center gap-2 mt-4">
                    <button
                      onClick={() => handleUpdate(student)}
                      className="flex items-center justify-center p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full transition"
                    >
                      <FiEdit size={18} />
                      <span className="ml-2 text-sm">Edit</span>
                    </button>

                    <button
                      onClick={() => handleDelete(student._id)}
                      className="flex items-center justify-center p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 w-full transition"
                    >
                      <FiTrash size={18} />
                      <span className="ml-2 text-sm">Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View (Table) */}
            <div className="hidden lg:block p-4 bg-white rounded-lg shadow-md overflow-auto">
              <div className="w-full max-w-full overflow-x-auto">
                <table className="w-full table-auto border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border border-gray-300 p-2">Image</th>
                      <th className="border border-gray-300 p-2">Name</th>
                      <th className="border border-gray-300 p-2">Email</th>
                      <th className="border border-gray-300 p-2">ID</th>
                      <th className="border border-gray-300 p-2">Mobile</th>
                      <th className="border border-gray-300 p-2">
                        Father's Name
                      </th>
                      <th className="border border-gray-300 p-2">Address</th>
                      <th className="border border-gray-300 p-2">
                        Registered On
                      </th>
                      <th className="border border-gray-300 p-2">Branch</th>
                      <th className="border border-gray-300 p-2">Course</th>
                      <th className="border border-gray-300 p-2">Status</th>
                      <th className="border border-gray-300 p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student) => (
                      <tr key={student._id} className="border border-gray-300">
                        <td className="border border-gray-300 p-2 text-center">
                          {student.image && (
                            <img
                              src={student.image}
                              alt={student.name}
                              className="w-12 h-12 object-cover rounded-full mx-auto"
                            />
                          )}
                        </td>
                        <td className="border border-gray-300 p-2 text-sm whitespace-nowrap font-bold">
                          {student.name}
                        </td>
                        <td className="border border-gray-300 p-2 text-sm font-bold">
                          {student.email}
                        </td>
                        <td className="border border-gray-300 p-2 text-[13px] whitespace-nowrap font-bold">
                          {student.userId}
                        </td>
                        <td className="border border-gray-300 p-2 text-sm font-bold">
                          {student.mobile}
                        </td>
                        <td className="border border-gray-300 p-2 text-sm whitespace-nowrap font-bold">
                          {student.fathername}
                        </td>
                        <td className="border border-gray-300 p-2 text-[12px] font-bold ">
                          {student.address}
                        </td>
                        <td className="border border-gray-300 p-2 text-sm font-bold">
                          {student.dor}
                        </td>
                        <td className="border border-gray-300 p-2 text-[12px] font-bold">
                          {student.branchName}
                        </td>
                        <td className="border border-gray-300 p-2 text-sm font-bold">
                          {student.courseName}
                        </td>
                        <td className="border border-gray-300 p-2 text-center font-bold">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium font-bold${
                              student.activeStatus
                                ? "bg-green-200 text-green-800"
                                : "bg-red-200 text-red-800"
                            }`}
                          >
                            {student.activeStatus ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="border border-gray-300 p-2">
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => handleUpdate(student)}
                              className="p-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                              <FiEdit size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(student._id)}
                              className="p-1 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                              <FiTrash size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {isModalOpen && selectedStudent && (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex justify-center items-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full  max-w-lg">
            <h3 className="text-xl font-semibold mb-4 text-center text-white">
              Update Student
            </h3>

            {/* Grid Layout for Two Inputs Per Row */}
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={selectedStudent.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={selectedStudent.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter Email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white">
                  Mobile
                </label>
                <input
                  type="text"
                  name="mobile"
                  value={selectedStudent.mobile}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter Mobile"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white">
                  Father's Name
                </label>
                <input
                  type="text"
                  name="fathername"
                  value={selectedStudent.fathername}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter Father's Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white">
                  Mother's Name
                </label>
                <input
                  type="text"
                  name="mothername"
                  value={selectedStudent.mothername}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter Mother's Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={selectedStudent.address}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rowhite"
                  placeholder="Enter Address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dob"
                  value={
                    selectedStudent.dob
                      ? new Date(selectedStudent.dob)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white">
                  Date of Registration
                </label>
                <input
                  type="date"
                  name="dor"
                  value={selectedStudent.dor}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white">
                  Gender
                </label>
                <select
                  name="gender"
                  value={selectedStudent.gender}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white">
                  Active Status
                </label>
                <select
                  name="activeStatus"
                  value={selectedStudent.activeStatus}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select Status</option>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white">
                  Marks
                </label>
                <input
                  type="number"
                  name="marks"
                  value={selectedStudent.marks || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white">
                  Grade
                </label>
                <input
                  type="text"
                  name="grade"
                  value={selectedStudent.grade || ""}
                  readOnly
                  className="w-full p-2 border border-gray-300 rounded-md bg-gray-200 text-black"
                />
              </div>

              <div>
                <input
                  type="text "
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md bg-white"
                />
              </div>
              <div>
                <button
                  onClick={handleVerifyOtp}
                  className="p-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer"
                >
                  Verify OTP
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 bg-gray-500 text-white rounded-lg mr-2 hover:bg-gray-600 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;
// here create a field for marks and grade and based on marks grade will be calculated in the bellow format and save in the database
// Grades – 90% & Above =A+, 80% - 89% = A, 70% - 79% = B+, 60% - 69% =B, 50% - 59% =C, 40% - 49% = D, Below 40% - Fail
