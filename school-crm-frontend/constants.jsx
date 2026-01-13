// import {
//   Student,
//   Teacher,
//   Lead,
//   Transaction,
//   UserRole,
//   Announcement,
// } from "./types";

import { UserRole } from "./types";

export const MOCK_STUDENTS = [
  {
    id: "S1",
    name: "Aarav Sharma",
    grade: "10th",
    section: "A",
    attendance: 95,
    feeStatus: "Paid",
    performance: 88,
    parentId: "P1",
  },
  {
    id: "S2",
    name: "Rohan Verma",
    grade: "10th",
    section: "A",
    attendance: 82,
    feeStatus: "Pending",
    performance: 72,
    parentId: "P2",
  },
  {
    id: "S3",
    name: "Ananya Iyer",
    grade: "11th",
    section: "B",
    attendance: 98,
    feeStatus: "Paid",
    performance: 95,
    parentId: "P3",
  },
  {
    id: "S4",
    name: "Priya Singh",
    grade: "9th",
    section: "C",
    attendance: 75,
    feeStatus: "Overdue",
    performance: 65,
    parentId: "P4",
  },
];

export const MOCK_TEACHERS = [
  {
    id: "T1",
    name: "Dr. Meera Kulkarni",
    subject: "Mathematics",
    classes: ["10th A", "11th B"],
    status: "Active",
    salary: 5500,
  },
  {
    id: "T2",
    name: "Rajesh Kumar",
    subject: "Physics",
    classes: ["12th A"],
    status: "Active",
    salary: 5200,
  },
  {
    id: "T3",
    name: "Sunita Banerjee",
    subject: "Literature",
    classes: ["9th C", "10th B"],
    status: "On Leave",
    salary: 4800,
  },
];

export const MOCK_LEADS = [
  {
    id: "L1",
    name: "Vikram Malhotra",
    email: "vikram@example.com",
    phone: "+919876543210",
    status: "New",
    source: "Facebook Ads",
  },
  {
    id: "L2",
    name: "Neha Gupta",
    email: "neha@example.com",
    phone: "+919876543211",
    status: "Contacted",
    source: "Website",
  },
];

export const MOCK_TRANSACTIONS = [
  {
    id: "TR1",
    studentName: "Aarav Sharma",
    amount: 1200,
    date: "2024-03-01",
    type: "Fee",
    status: "Success",
  },
  {
    id: "TR2",
    studentName: "Dr. Meera Kulkarni",
    amount: 5500,
    date: "2024-03-02",
    type: "Salary",
    status: "Success",
  },
  {
    id: "TR3",
    studentName: "Rohan Verma",
    amount: 1200,
    date: "2024-03-05",
    type: "Fee",
    status: "Pending",
  },
];

export const MOCK_ANNOUNCEMENTS = [
  {
    id: "A1",
    title: "Annual Sports Day",
    content:
      "All students are invited to participate in the Annual Sports Day on March 25th.",
    date: "2024-03-10",
    author: "Principal",
    target: [UserRole.STUDENT, UserRole.PARENT, UserRole.TEACHER],
  },
  {
    id: "A2",
    title: "Parent-Teacher Meeting",
    content: "The Parent-Teacher Meeting is scheduled for this Saturday.",
    date: "2024-03-12",
    author: "Admin",
    target: [UserRole.PARENT, UserRole.TEACHER],
  },
];
