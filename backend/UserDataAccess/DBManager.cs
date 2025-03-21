using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Npgsql;
using Microsoft.Extensions.Configuration;

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

        public NpgsqlConnection connect() 
        {
            var db = new NpgsqlConnection(settings?.ConnectionString);
            db.Open();

            return db;
        }

        public void close(NpgsqlConnection db) 
        {
            db.Close();
        }

        public List<Dictionary<string, object>> select(NpgsqlConnection db, string? query)
        {
            var results = new List<Dictionary<string, object>>();

            try
            {
                using (var cmd = new NpgsqlCommand(query, db))
                {
                    using (var reader = cmd.ExecuteReader()) 
                    {
                        while (reader.Read())
                        {
                            var row = new Dictionary<string, object>();
                            for (int i = 0; i < reader.FieldCount; i++)
                            {
                                row[reader.GetName(i)] = reader.GetValue(i);
                            }
                            results.Add(row);
                        }
                    }
                }
            }
            catch (NpgsqlException ex)
            {
                Console.WriteLine("Bad input error: \n" + ex.Message);
            }

            return results;
        }


        public bool insert(NpgsqlConnection db, string? query) 
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

        public int update(NpgsqlConnection db, string? query) 
        {
            try
            {
                var cmd = new NpgsqlCommand(query, db);
                return cmd.ExecuteNonQuery();
            }
            catch (NpgsqlException ex)
            {
                Console.WriteLine("Bad input error: \n" + ex.Message);
                return 0;
            }
        }

        public int delete(NpgsqlConnection db, string? query)
        {
            try
            {
                var cmd = new NpgsqlCommand(query, db);
                return cmd.ExecuteNonQuery();
            }
            catch (NpgsqlException ex)
            {
                Console.WriteLine("Bad input error: \n" + ex.Message);
                return 0;
            }
        }
    }
}