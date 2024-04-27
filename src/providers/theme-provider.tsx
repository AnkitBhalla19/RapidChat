"use client";
import { Button, ConfigProvider } from 'antd'
import React from 'react'

function ThemeProvider({children}:{children:React.ReactNode}) {
  return (
    <div>
    <ConfigProvider
    theme={{
        token:{
            colorPrimary:'#31304D',
            borderRadius:2,
        },
        components:{
            Button:{
                controlHeight:40,
                boxShadow: 'none',
                colorPrimaryBgHover: '#31304D',
                colorPrimaryHover:'#31304D',
                controlOutline:'none',
                colorBorder: '#31304D',
    }}
}} >{children}</ConfigProvider>
    </div>
  ) 
}

export default ThemeProvider;