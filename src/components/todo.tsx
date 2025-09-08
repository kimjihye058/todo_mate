import styled from "styled-components";

function Todo() {
  return (
    <div>
      <CategoryBtn>
        <GlobalIcon />
        <CategoryTitle>todo</CategoryTitle>
        <Plus />
      </CategoryBtn>
      <TodoList>
        <CheckBtn>
          <CheckBtnImg></CheckBtnImg>
        </CheckBtn>
        <InputBox type="text" placeholder="할 일 입력" />
        <OptionBtn>
          <OptionBtnImg></OptionBtnImg>
        </OptionBtn>
      </TodoList>
    </div>
  );
}

export default Todo;

export const CategoryBtn = styled.button`
  border-radius: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f2f2f2;
  padding: 8px 10px;
  margin-top: 8px;
`;

export const GlobalIcon = styled.img.attrs({
  src: "./images/feed/globalIcon.svg",
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

export const TodoList = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const CheckBtn = styled.button`
  background-color: white;
  padding: 0;
  height: 21px;
  margin-right: 10px;
`;

export const CheckBtnImg = styled.img.attrs({
  src: "./images/feed/goalIcon.svg",
})`
  width: 21px;
  height: 21px;
`;

export const InputBox = styled.input`
  border: none;
  border-bottom: 2px solid #000;
  width: 377px;
  height: 40px;
  ::placeholder {
    font-family: Pretendard;
    font-weight: 500;
    font-size: 15px;
    color: #4c4c4c;
  }
`;

export const OptionBtn = styled.button`
  background-color: white;
  padding: 0;
  height: 20px;
`;

export const OptionBtnImg = styled.img.attrs({
  src: "./images/option/feedOptionMenuIcon.png",
})`
  width: 20px;
  height: 20px;
`;
