const Navigation = ({ setPage, token, logout }) => {
  return (
    <div>
      <button onClick={() => setPage("authors")}>authors</button>
      <button onClick={() => setPage("books")}>books</button>
      {token ? (
        <>
          <button onClick={() => setPage("add")}>add book</button>
          <button onClick={() => setPage("recommendations")}>recommendations</button>
          <button onClick={logout}>logout</button>
        </>
      ) : (
        <>
          <button onClick={() => setPage("login")}>login</button>
        </>
      )}
    </div>
  );
};

export default Navigation;
