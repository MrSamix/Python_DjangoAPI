import { Button } from "antd";
import { useNavigate } from "react-router";

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav style={{top: 0, left: 0, width: '100%', position: "fixed"}}>
      <ul style={{display: "flex", listStyle: "none", justifyContent: "center", gap: 20}}>
        <li>
          <Button type="primary" onClick={() => navigate("/")}>
            Home
          </Button>
        </li>
        <li>
           <Button variant="solid" color="green" onClick={() => navigate("/auth/register")}>
              Sign Up
            </Button>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar;