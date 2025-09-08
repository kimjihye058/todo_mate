import styled from "styled-components";

function Todo() {
  return (
    <div>
      <Category>
        <GlobalIcon></GlobalIcon>
        <CategoryTitle>할 일</CategoryTitle>
        <Plus></Plus>
      </Category>
    </div>
  );
}
export default Todo;

export const Category = styled.button`
  border-radius: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #F2F2F2;
  padding: 8px 10px;
`;

export const GlobalIcon = styled.img.attrs({
  src: "./images/feed/goalIcon.svg",
})`
  width: 16px;
  height: 16px;
  margin-right: 5px;
`;

export const CategoryTitle = styled.p`
  font-family: Pretendard;
  font-weight: 600;
  font-size: 14px;
  margin: 0;
`;

export const Plus = styled.img.attrs({
  src: "./images/feed/feedAddBtnIcon.png",
})`
  width: 20px;
  height: 20px;
  margin-left: 5px;
`;
