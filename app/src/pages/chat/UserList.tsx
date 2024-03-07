const UserList = ({ users }) => {
  console.log("users", users);

  const handleClick = () => {
    console.log("handleClick");
  };

  return (
    <div>
      UserList
      {users.map((user: any) => (
        <div onClick={() => handleClick()} key={user.id}>
          {user.user.username}
        </div>
      ))}
    </div>
  );
};

export default UserList;
