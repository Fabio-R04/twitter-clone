import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from './App';
import "./sass/main.scss";

const container = document.getElementById('root')!;
const root = createRoot(container);
const queryClient: QueryClient = new QueryClient();

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <GoogleOAuthProvider clientId={`${process.env.REACT_APP_GOOGLE_CLIENT_ID}`}>
                <QueryClientProvider client={queryClient}>
                    <App />
                </QueryClientProvider>
            </GoogleOAuthProvider>
        </Provider>
    </React.StrictMode>
);