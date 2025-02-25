using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Npgsql;

namespace backend.UserDataAccess
{
    public class DBManager
    {
        private static NpgsqlConnectionStringBuilder? settings;

        public DBManager()
        {
            settings = new NpgsqlConnectionStringBuilder();
            settings.Host = "localhost";
            settings.Username = "dbadm";
            settings.Password = "dbadm";
            settings.Database = "feedbacker";
        }

        public NpgsqlConnection connect() // connect to the database
        {
            var db = new NpgsqlConnection(settings?.ConnectionString);
            db.Open();

            return db;
        }

        public void close(NpgsqlConnection db) // close database connection
        {
            db.Close();
        }

        public List<Dictionary<string, object>> select(NpgsqlConnection db, string? query) // function for SELECT sql query
        {
            var cmd = new NpgsqlCommand(query, db);
            var reader = cmd.ExecuteReader();

            var results = new List<Dictionary<string, object>>();

            while (reader.Read())
            {
                var row = new Dictionary<string, object>();
                for (int i = 0; i < reader.FieldCount; i++)
                {
                    row[reader.GetName(i)] = reader.GetValue(i);
                }
                results.Add(row);
            }

            return results;
        }

        public bool insert(NpgsqlConnection db, string? query) // function for all SQL queries which are not SELECT
        {
            bool success = false;
            try 
            {
                var cmd = new NpgsqlCommand(query, db);
                cmd.ExecuteNonQuery();
                success = true;
            }
            catch (NpgsqlException ex)
            {
                Console.WriteLine("Bad input error: \n" + ex.Message);
            }

            return success;
        }
    }
}