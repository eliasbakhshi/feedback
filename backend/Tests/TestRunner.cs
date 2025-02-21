using System;
using backend.Models;
using backend.UserDataAccess;
using backend.Controllers;

namespace backend.Tests
{
    public static class TestRunner
    {
        public static void RunAllTests()
        {
            Console.WriteLine("Running tests...");
            bool allTestOK = true;

            DBManager dbManager = new DBManager();

            if (!TestDatabaseConnection(dbManager))
            {
                allTestOK = false;
                Console.WriteLine("Database connection failed");
            }











            if (allTestOK)
                System.Console.WriteLine("All tests passed!");
        }

        private static bool TestDatabaseConnection(DBManager dbManager)
        {
            bool okTest = false;

            try
            {
                var db = dbManager.connect();

                if (db.State == System.Data.ConnectionState.Open)
                    okTest = true;
                else
                    okTest = false;
            }
            catch (Exception e)
            {
                okTest = false;
                Console.WriteLine(e.Message);
            }
            return okTest;
        }

    }
}

