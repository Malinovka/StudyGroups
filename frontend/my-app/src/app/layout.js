'use client';
import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "@/app/provider/authProvider";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          backgroundColor: 'lavender',
          color: 'black', // optional: ensures text is readable
          '&:hover': {
            backgroundColor: '#e6e6fa', // slightly darker on hover
          },
        },
      },
    },
  },
});

export default function RootLayout({ children }) {
  return (
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
            <AuthProvider>
              {children}
            </AuthProvider>
        </ThemeProvider>
        </body>
      </html>
  );
}
