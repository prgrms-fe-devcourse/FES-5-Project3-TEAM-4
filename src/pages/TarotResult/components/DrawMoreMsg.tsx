import DrawMoreBtn from './DrawMoreBtn';

function DrawMoreMsg() {
  return (
    <div className="flex flex-col justify-center items-center text-main-white gap-4">
      <div className="flex flex-col justify-center items-center">
        <h3>
          <strong className="text-red-500">경고가 표시된 카드</strong>는 맥락에 따라 의미가 달라질
          수 있습니다.
        </h3>
        <h3>보조 카드를 함께 확인하시면 해석의 선명도가 높아집니다.</h3>
      </div>
      <DrawMoreBtn></DrawMoreBtn>
    </div>
  );
}
export default DrawMoreMsg;
