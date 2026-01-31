import {
    Public_Sans,
    Inter,
    Manrope,
    Roboto,
    Open_Sans,
    Lato,
    Poppins,
    Montserrat,
    Raleway,
    Work_Sans,
    DM_Sans,
    Outfit,
    Nunito
} from 'next/font/google';

// Cấu hình các font chữ
const publicSans = Public_Sans({
    subsets: ['vietnamese', 'latin'],
    display: 'swap',
    variable: '--font-public-sans',
});

const inter = Inter({
    subsets: ['vietnamese', 'latin'],
    display: 'swap',
    variable: '--font-inter',
});

const manrope = Manrope({
    subsets: ['vietnamese', 'latin'],
    display: 'swap',
    variable: '--font-manrope',
});

const roboto = Roboto({
    subsets: ['vietnamese', 'latin'],
    weight: ['400', '500', '700'],
    display: 'swap',
    variable: '--font-roboto',
});

const openSans = Open_Sans({
    subsets: ['vietnamese', 'latin'],
    display: 'swap',
    variable: '--font-open-sans',
});

const lato = Lato({
    subsets: ['latin'],
    weight: ['400', '700'],
    display: 'swap',
    variable: '--font-lato',
});

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    display: 'swap',
    variable: '--font-poppins',
});

const montserrat = Montserrat({
    subsets: ['vietnamese', 'latin'],
    display: 'swap',
    variable: '--font-montserrat',
});

const raleway = Raleway({
    subsets: ['vietnamese', 'latin'],
    display: 'swap',
    variable: '--font-raleway',
});

const workSans = Work_Sans({
    subsets: ['vietnamese', 'latin'],
    display: 'swap',
    variable: '--font-work-sans',
});

const dmSans = DM_Sans({
    subsets: ['latin', 'latin-ext'],
    display: 'swap',
    variable: '--font-dm-sans',
});

const outfit = Outfit({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-outfit',
});

const nunito = Nunito({
    subsets: ['vietnamese', 'latin'],
    display: 'swap',
    variable: '--font-nunito',
});

export const fontVariables = [
    publicSans,
    inter,
    manrope,
    roboto,
    openSans,
    lato,
    poppins,
    montserrat,
    raleway,
    workSans,
    dmSans,
    outfit,
    nunito
].map(font => font.variable).join(" ");
