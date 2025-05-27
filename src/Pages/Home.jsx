import Advantages from "../Sections/Advantages/Advantages";
import CTA from "../Sections/CTA/CTA";
import FAQ from "../Sections/FAQ/FAQ";
import Heros from "../Sections/Heros/Heros";
import Footer from "../Components/Footer/Footer";
import Header from "../Components/Header/Header";

function Home () {
    return (
        <>
            <Header/>
            <Heros/>
            <Advantages/>
            <FAQ/>
            <CTA/>
            <Footer/>
        </>
    )
}

export default Home;