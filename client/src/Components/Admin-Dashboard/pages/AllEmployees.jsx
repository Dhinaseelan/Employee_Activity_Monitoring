import React, { useContext } from 'react';
import '../css/AllEmployees.css';
import { FaTrash } from 'react-icons/fa6';
import { FaRegEdit } from 'react-icons/fa';
import DataContext from '../../../Context/AdminContext/Datacontext';

const AllEmployees = () => {
    const { handleEdit, handleEmployeeDelete, allCombined } =
        useContext(DataContext);

    const getImageSrc = (image) => {
        if (!image || !image.data) return null;
        try {
            // Fallback store: data is a base64 string
            if (typeof image.data === 'string') {
                return `data:${image.contentType};base64,${image.data}`;
            }
            // MongoDB: data.data is a Buffer
            if (image.data.data) {
                const base64String = btoa(
                    new Uint8Array(image.data.data).reduce(
                        (data, byte) => data + String.fromCharCode(byte),
                        '',
                    ),
                );
                return `data:${image.contentType};base64,${base64String}`;
            }
            return null;
        } catch (err) {
            console.error('Image conversion error:', err);
            return null;
        }
    };

    return (
        <div className="container add-employee-page">
            <div>
                <div className="col-12 text-center allemp-heading">
                    <h5>All Employees</h5>
                </div>
            </div>

            <div className="d-block d-lg-flex my-3">
                <div className="col-md-6 col-12">
                    <h3>Employee List</h3>
                </div>
            </div>

            <div className="table-div">
                <table className="table table-striped table-responsive-sm">
                    <thead className="table-light table-heading">
                        <tr>
                            <th>SI.No</th>
                            <th>Image</th>
                            <th>FirstName</th>
                            <th>LastName</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Status</th>
                            <th>Role</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>

                    <tbody className="tbody">
                        {allCombined.length > 0 ? (
                            allCombined.map((each, index) => {
                                const imageSrc = getImageSrc(each.image);

                                return (
                                    <tr key={each._id}>
                                        <td>{index + 1}</td>

                                        {/* IMAGE */}
                                        <td>
                                            {imageSrc ? (
                                                <img
                                                    src={imageSrc}
                                                    alt="employee"
                                                    style={{
                                                        width: '50px',
                                                        height: '50px',
                                                        objectFit: 'cover',
                                                        borderRadius: '50%',
                                                    }}
                                                />
                                            ) : (
                                                <span>No Image</span>
                                            )}
                                        </td>

                                        <td>{each.firstName}</td>
                                        <td>{each.lastName}</td>
                                        <td>{each.email}</td>
                                        <td>{each.phone}</td>
                                        <td>{each.status}</td>
                                        <td>{each.role}</td>

                                        <td>
                                            <button
                                                className="btn btn-success btn-sm"
                                                onClick={() => handleEdit(each)}
                                            >
                                                <FaRegEdit />
                                            </button>
                                        </td>

                                        <td>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() =>
                                                    handleEmployeeDelete(
                                                        each._id,
                                                    )
                                                }
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="10" className="text-center">
                                    No Employee Added.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AllEmployees;
