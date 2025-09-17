import styled from "styled-components";
import Calendar from "./components/Calendar";
import Todo from "./components/todo";

function Home() {
  return (
    <Body>
      <Calendar />
      <Todo />
    </Body>
  );
}
export default Home;

export const Body = styled.div`
  display: grid;
  grid-template-columns: 346px auto;
  gap: 60px;
  width: 100%;
  padding: 0px 48px;
`;
