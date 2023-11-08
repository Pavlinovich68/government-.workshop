/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useContext, useEffect, useRef, useState } from 'react';

import {router} from "next/client";
import {useRouter} from "next/navigation";
import Layout from '../../layout/layout';

const Dashboard = () => {
   return (
      <Layout>
         <div className="grid"></div>
      </Layout>
   );
};

export default Dashboard;
