import React from "react";
import { useSearch } from "../../context/search";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SearchInput = () => {
  const [value, setValue] = useSearch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/search/${value.keyword}`
      );

      setValue({ ...value, results: data });
      navigate("/search");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="d-flex">
      <input
        type="text"
        value={value.keyword}
        onChange={(e) => setValue({ ...value, keyword: e.target.value })}
        placeholder="Search products..."
        className="form-control me-2"
      />
      <button
        type="submit"
        className="btn btn-primary"
      >
        Search
      </button>
    </form>
  );
};

export default SearchInput;
