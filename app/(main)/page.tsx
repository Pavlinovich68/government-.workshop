/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {useSession} from "next-auth/react";
import {router} from "next/client";
import {useRouter} from "next/navigation";
import Layout from '../../layout/layout';

const Dashboard = () => {
   const {data: session, status, update} = useSession();

   console.log('useSession Hook session object', session)

   return (
      <Layout>
         <div className="grid"></div>
      </Layout>
   );
};

export default Dashboard;
