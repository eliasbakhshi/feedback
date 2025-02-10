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
            settings.Username = "postgres";
            settings.Password = "postgres";
            settings.Database = "hello";
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

        public List<Dictionary<string, object>> command(NpgsqlConnection db, string? query)
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
    }
}