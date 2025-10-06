import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import prisma from '../../../prisma/client';
import React from 'react';

export default async function SubscriptionRequired({ children }) {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;


  if (!token || !process.env.JWT_SECRET) {
    redirect('/auth/login?message=Please log in to view your profile');
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {

    console.error("JWT verification failed in SubscriptionRequired:", err);
    redirect('/auth/login?message=Session expired, please log in again');
  }

  if (!decoded || !decoded.id) {
     redirect('/auth/login?message=Invalid user session');
  }
  
  const userId = decoded.id; 
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    redirect('/auth/login?message=User not found');
  }

  const activeSub = await prisma.subscription.findFirst({
    where: {
      userId: user.id,
      status: { in: ["ACTIVE", "TRIALING"] },
      stripeCurrentPeriodEnd: { gte: new Date() },
    },
  });

  const isSubscribed = !!activeSub;



  if (!isSubscribed) {
    redirect('/subscribe?message=Subscription required to view this page');
  }
  
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { user, activeSub });
    }
    return child;
  });

  return <>{childrenWithProps}</>;
}
