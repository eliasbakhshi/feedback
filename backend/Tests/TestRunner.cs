using System;
using backend.Models;
using backend.UserDataAccess;
using backend.Controllers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;

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
                return;
            }

            if (!TestRegistrationController(dbManager))
            {
                allTestOK = false;
                return;
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

            }
            catch (Exception e)
            {
                okTest = false;
                Console.WriteLine("Database connection failed: " + e.Message);
            }
            return okTest;
        }

        private static bool TestRegistrationController(DBManager dbManager)
        {
            bool okTest = false;

            try
            {
                var mockLogger = new Mock<ILogger<RegistrationController>>();

                RegistrationController registrationController = new RegistrationController(mockLogger.Object);

                RegistrationModel registration = new RegistrationModel
                {
                    FullName = "Test User",
                    Email = "test.user10@testmail.com",
                    Password = "password"
                };

                var result = registrationController.Register(registration);

                if (result is ObjectResult objectResult)
                {
                    if (objectResult.StatusCode == 200)
                        okTest = true;
                    else
                        Console.WriteLine($"Registration controller failed: {objectResult.Value}");
                }
                else
                {
                    okTest = false;
                }
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

