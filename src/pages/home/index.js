import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Table } from "react-bootstrap";
import classes from "./Home.module.css";
import moment from "moment";
import ReactSelect from "react-select";

const Home = () => {
  const [faqs, setFaqs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const options = [
    { value: "all", label: "All statuses" },
    { value: "true", label: "Active" },
    { value: "false", label: "Inactive" },
  ];

  async function fetchData(
    page = currentPage,
    search = searchTerm,
    filter = statusFilter
  ) {
    setLoading(true);
    try {
      const url =
        "https://bbfa-2407-aa80-14-9933-edfd-6aa0-ba08-4c09.ngrok-free.app/api/v1/faqs";
      const response = await axios.get(
        `${url}?limit=${10}&page=${page}&search=${search}&status=${filter}`,
        {
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZDY0NTc0NTUyNDJmYjYwNjQ5MGY0MCIsImlhdCI6MTcyNjA3NTQ5OCwiZXhwIjoxNzI2MTYxODk4fQ.OJxFgnHU95ZhOVTBPUM3ghBv2xDHSsNJW-MKo91AmkM",
            "ngrok-skip-browser-warning": "69420",
          },
        }
      );
      setFaqs(response.data.data.faqs);
      setTotalPages(Math.ceil(response.data.data.totalCount / 10));
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData(currentPage, searchTerm, statusFilter);
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
    setTimeout(() => {
      const value = e.target.value;
      fetchData(1, value, statusFilter);
    }, 1000);
  };

  const handleStatusChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "all";
    setStatusFilter(value);
    setCurrentPage(1);
    fetchData(1, searchTerm, value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchData(page, searchTerm, statusFilter);
  };

  if (error) return <p>Error: {error.message}</p>;

  return (
    <Container className={classes.mainBody}>
      <div className={classes.contentBody}>
        <h1 className={classes.mainHeading}>FAQs</h1>
        <div className={classes.inputs}>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search FAQs"
            className={classes.searchInput}
          />
          <ReactSelect
            options={options}
            placeholder="Select status"
            value={options.find((option) => option.value === statusFilter)}
            onChange={handleStatusChange}
            className={classes.statusFilter}
          />
        </div>

        {loading ? (
          <h1 className={classes.loading}>Loading...</h1>
        ) : error ? (
          <p>Error: {error.message}</p>
        ) : faqs.length > 0 ? (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Question</th>
                <th>Answer</th>
                <th>Category</th>
                <th>Active</th>
                <th>Created At</th>
                <th>Updated At</th>
              </tr>
            </thead>
            <tbody>
              {faqs.map((faq, index) => (
                <tr key={faq._id}>
                  <td>{(currentPage - 1) * 10 + index + 1}</td>
                  <td>{faq.question}</td>
                  <td>{faq.answer}</td>
                  <td>{faq.category.name}</td>
                  <td>{faq.active ? "Yes" : "No"}</td>
                  <td>{moment().format("MMM Do YY")}</td>
                  <td>{moment(faq.updatedAt).format("MMM Do YY")}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <h1 className={classes.loading}>No FAQs available.</h1>
        )}

        <div className={classes.paginationControls}>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={
                currentPage === index + 1
                  ? classes.activePageButton
                  : classes.pageButton
              }
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </Container>
  );
};

export default Home;
