using Dapper;
using Dapper.Contrib.Extensions;
using Npgsql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace MessageMeAPI.Daos
{
    public class DAOBase<T> : DAOBase where T : class
    {

        public T GetById(long id)
        {
            using var connection = new NpgsqlConnection(ConnectionString);
            return connection.Get<T>(id);
        }

        public List<T> Query(string str, dynamic param = null)
        {
            using var connection = new NpgsqlConnection(ConnectionString);
            return connection.Query<T>(str, param: (object)param).ToList();
        }

        public T Get(Func<T, bool> filter)
        {
            using var connection = new NpgsqlConnection(ConnectionString);
            return connection.GetAll<T>().Where(filter).ToList().FirstOrDefault();
        }

        public List<T> GetAll(string filterQuery = "", bool overrideSQL = false)
        {
            using var connection = new NpgsqlConnection(ConnectionString);
            string sqlCommand;
            if (overrideSQL)
            {
                sqlCommand = filterQuery;
            }
            else
            {
                sqlCommand = getBaseSQL(false) + filterQuery;
            }
            return connection.Query<T>(sqlCommand /* + " limit 1000 "*/).ToList();
            //return connection.GetAll<T>().ToList();
        }

        private string getBaseSQL(bool includesWhere = true)
        {
            string postTableName = TableName();
            string sqlCommand = " select * from " + postTableName + (includesWhere ? " where " : "");
            return sqlCommand;
        }

        protected string TableName()
        {
            if (SqlMapperExtensions.TableNameMapper != null)
                return SqlMapperExtensions.TableNameMapper(typeof(T));
            string getTableName = "GetTableName";
            MethodInfo getTableNameMethod = typeof(SqlMapperExtensions).GetMethod(getTableName, BindingFlags.NonPublic | BindingFlags.Static);
            if (getTableNameMethod == null)
                throw new ArgumentOutOfRangeException($"Method '{getTableName}' is not found in '{nameof(SqlMapperExtensions)}' class.");
            return getTableNameMethod.Invoke(null, new object[] { typeof(T) }) as string;
        }

        public List<T> Find(string sqlFilter, bool overrideSQL = false)
        {
            using var connection = new NpgsqlConnection(ConnectionString);
            string sqlCommnand;
            if (overrideSQL)
            {
                sqlCommnand = sqlFilter;
            }
            else
            {
                sqlCommnand = getBaseSQL(!String.IsNullOrEmpty(sqlFilter)) + sqlFilter;
            }
            List<T> internalList = connection.Query<T>(sqlCommnand).ToList();
            return internalList;
        }

        public long Insert(T entity)
        {
            using var connection = new NpgsqlConnection(ConnectionString);
            return connection.Insert(entity);
        }

        public long Insert(List<T> entities)
        {
            using var connection = new NpgsqlConnection(ConnectionString);
            return connection.Insert(entities);
        }

        public bool Update(T entity)
        {
            using var connection = new NpgsqlConnection(ConnectionString);
            return connection.Update(entity);
        }

        public bool Update(List<T> entities)
        {
            using var connection = new NpgsqlConnection(ConnectionString);
            return connection.Update(entities);
        }

        public bool Delete(T entity)
        {
            using var connection = new NpgsqlConnection(ConnectionString);
            return connection.Delete(entity);
        }

        public bool Delete(List<T> entities)
        {
            using var connection = new NpgsqlConnection(ConnectionString);
            return connection.Delete(entities);
        }

    }

    public class DAOBase
    {
        protected string ConnectionString = "Host=ec2-23-23-36-227.compute-1.amazonaws.com;Username=dvehbswbgpyzpz;Password=ce7e7042eece7ba1d0960120430a90e380392363d45bfa193fea4f8c9ceaeb4b;Database=db5hukpvkeh1d1;SSL Mode=Require;Trust Server Certificate=true";

        public NpgsqlConnection AbrirConexao()
        {
            NpgsqlConnection conn = new NpgsqlConnection(ConnectionString);
            conn.Open();
            return conn;
        }

        public void FecharConexao(NpgsqlConnection connection)
        {
            connection.Close();
        }

        public IEnumerable<dynamic> ExecuteReader(string sql, dynamic param = null, CommandType commandType = CommandType.Text)
        {
            using var connection = new NpgsqlConnection(ConnectionString);
            return connection.Query(sql, param: (object)param, commandType: commandType);
        }

        public dynamic ExecuteScalar(string sql, dynamic param = null, CommandType commandType = CommandType.Text)
        {
            using var connection = new NpgsqlConnection(ConnectionString);
            return connection.ExecuteScalar(sql, param: (object)param, commandType: commandType);
        }

        public int ExecuteNonQuery(string sql, dynamic param = null, CommandType commandType = CommandType.Text)
        {
            using var connection = new NpgsqlConnection(ConnectionString);
            return connection.Execute(sql, param: (object)param, commandTimeout: 120, commandType: commandType);
        }

    }
}
