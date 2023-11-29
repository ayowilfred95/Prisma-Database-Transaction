
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

interface Account {
  name: string;
  balance: number;
}

// let fund the account first
const fundAccount = async (name: string, initialBalance: number): Promise<void> => {
    await prisma.account.create({
      data: {
        name,
        balance: initialBalance,
      },
    });
  };


// we can initiate the transfer process
const transferMoney = async (from: string, to: string, amount: number): Promise<void> => {
  await prisma.$transaction(async (tx) => {
    
// 1. Decrement amount from the sender.
const sender = await tx.account.update({
    data:{
        balance:{
            decrement:amount,
        },
    },
    where:{
        name:from,
    },
})
 // 2. Verify that the sender's balance didn't go below zero.
 if (sender.balance < 0) {
    throw new Error(`${from} doesn't have enough to send ${amount}`)
  }

  // 3. Increment the recipient's balance by amount
  const recipient = await tx.account.update({
    data: {
      balance: {
        increment: amount,
      },
    },
    where: {
      name: to,
    },
  })
  console.log(`${from} transfer  ${amount} to ${to}`)
  return recipient
      
  });
};



// Example usage
async function main() {
  try {

     // Fund Wilfred and David's accounts initially
     await fundAccount('Wilfred', 100); 
     await fundAccount('David', 100);   
     console.log('Wilfred account funded successfully with $100');
     console.log('David account funded successfully with $100');


    // This transfer is successful
    await transferMoney('Wilfred', 'David', 100);

    // This transfer is unsuccessfull
    await transferMoney('Wilfred','David',100);

   

  } catch (error) {
    console.error('Transfer failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

