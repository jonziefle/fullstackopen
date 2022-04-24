import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import Select from "react-select";

import { GET_ALL_AUTHORS, EDIT_BIRTHYEAR } from "../queries";

const Authors = ({ show, token }) => {
  const [selectedName, setSelectedName] = useState(null);
  const [year, setYear] = useState("");

  const result = useQuery(GET_ALL_AUTHORS);
  const [editBirthyear] = useMutation(EDIT_BIRTHYEAR, {
    refetchQueries: [{ query: GET_ALL_AUTHORS }],
  });

  const handleSetBirthyear = (event) => {
    event.preventDefault();

    editBirthyear({ variables: { name: selectedName.value, year } });

    setSelectedName(null);
    setYear("");
  };

  if (!show) {
    return null;
  }

  if (result.loading) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {result.data.allAuthors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {token && (
        <>
          <h3>Set birthyear</h3>
          <form onSubmit={handleSetBirthyear}>
            <div>
              <label>
                Name:
                <Select
                  options={result.data.allAuthors.map((a) => ({
                    value: a.name,
                    label: a.name,
                  }))}
                  onChange={setSelectedName}
                />
              </label>
            </div>
            <div>
              <label>
                Birthyear:
                <input
                  value={year}
                  onChange={({ target }) => setYear(Number(target.value))}
                />
              </label>
            </div>
            <button type="submit">change number</button>
          </form>
        </>
      )}
    </div>
  );
};

export default Authors;
