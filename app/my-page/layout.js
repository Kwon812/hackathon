'use client'
import {ThemeProvider} from "styled-components";


export const theme = {
    colors: {
        primary: '#1976D2', // 메인 블루
        primaryDark: '#0D47A1', // 어두운 블루
        primaryLight: '#BBDEFB', // 밝은 블루
        secondary: '#F5F5F5', // 보조 회색
        white: '#FFFFFF',
        black: '#212121',
        gray: '#757575',
        lightGray: '#E0E0E0',
        chipRed: '#E57373',
        chipYellow: '#FFD54F',
        chipGreen: '#81C784',
        chipBlue: '#64B5F6',
    },
    gradients: {
        header: 'linear-gradient(to bottom, #42a5f5, #1565c0)',
    }
};

export default function MyPageLayout({children}) {



    return (
        <ThemeProvider theme={theme}>
        {children}
        </ThemeProvider>
    )
}