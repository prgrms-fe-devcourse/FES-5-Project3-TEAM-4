import NightStarBackGround from './components/NightStarBackGround';
import Section01 from './Section01/Section01';

function Home() {
  return (
    <>
      <section id="container" className="absolute z-1 w-full">
        <Section01 />
      </section>
      <NightStarBackGround className="fixed" />
    </>
  );
}
export default Home;
