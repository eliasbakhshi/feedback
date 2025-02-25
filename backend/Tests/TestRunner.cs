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
            }

            if (!TestRegistrationController())
            {
                allTestOK = false;
            }

            if (!TestLoginController(dbManager))
            {
                allTestOK = false;
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

        private static bool TestRegistrationController()
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
                Console.WriteLine("Registration exception: " + e.Message);
            }

            return okTest;
        }

        private static bool TestLoginController(DBManager dbManager)
        {
            bool okTest = false;

            try
            {
                var mockLogger = new Mock<ILogger<LoginController>>();

                LoginController loginController = new LoginController(mockLogger.Object);

                LoginModel correctLogin = new LoginModel
                {
                    Email = "test.user10@testmail.com",
                    Password = "password"
                };

                var resultCorrectLogin = loginController.Login(correctLogin);

                if (resultCorrectLogin is ObjectResult objectResult) // expect correct login
                {
                    if (objectResult.StatusCode == 200)
                        okTest = true;
                    else
                        Console.WriteLine($"LoginController failed, expected objectResult.StatusCode == 200 but got: {objectResult.Value}");
                }
                else
                    okTest = false;


                LoginModel incorrectLogin = new LoginModel
                {
                    Email = "test.user10@mail",
                    Password = "possword"
                };

                var resultIncorrectLogin = loginController.Login(incorrectLogin);

                if (resultIncorrectLogin is ObjectResult objectResult2) // expect incorrect login
                {
                    if (objectResult2.StatusCode == 401)
                        okTest = true;
                    else
                        Console.WriteLine($"LoginController failed, expected objectResult.StatusCode == 401 but got: {objectResult2.Value}");
                }
                else
                    okTest = false;
            }
            catch (Exception e)
            {
                okTest = false;
                Console.WriteLine("Login exception: " + e.Message);
            }

            return okTest;
        }
    }
}

