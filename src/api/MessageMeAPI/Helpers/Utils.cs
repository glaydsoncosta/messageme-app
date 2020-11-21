using MessageMeAPI.Daos;
using MessageMeAPI.Helpers;
using System;
using System.Linq;

namespace MessageMeAPI.Controllers
{
    public static class Utils
    {
        public static DateTime DateNow(this DateTime dt)
        {
            DateTime timeUtc = DateTime.UtcNow;
            TimeZoneInfo kstZone;
            if (Consts.DEBUG_MODE)
            {
                kstZone = TimeZoneInfo.FindSystemTimeZoneById("E. South America Standard Time"); // Brasilia/BRA
            }
            else
            {
                kstZone = TimeZoneInfo.FindSystemTimeZoneById("America/Fortaleza");
            }
            DateTime dateTimeBrasilia = TimeZoneInfo.ConvertTimeFromUtc(timeUtc, kstZone);
            return dateTimeBrasilia;
        }

        public static object emptyBody()
        {
            return new { };
        }

        public static long SequenceNextValue(string sequenceName)
        {
            DAOBase daoBase = new DAOBase();
            var resultado = daoBase.ExecuteReader("SELECT nextval('" + sequenceName + "');", null, System.Data.CommandType.Text).FirstOrDefault();
            return resultado.nextval;
        }

        public static long seedSeq(string tableName)
        {
            return SequenceNextValue(tableName + "_id_seq");
        }

        public static Version getVersion()
        {
            var version = System.Reflection.Assembly.GetExecutingAssembly().GetName().Version;
            return version;
        }
    }
}
