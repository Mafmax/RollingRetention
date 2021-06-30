using Mafmax.RollingRetention.App.Context.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Mafmax.RollingRetention.App.Context
{
    public class RollingRetentionContext : DbContext
    {


        public RollingRetentionContext()
        {
            Database.EnsureCreated();
        }
        public DbSet<UserEntity> Users { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            var uriString = "postgres://zzljckrb:qbjBNYcdlm_UGhunV1KdSGzeYB9A3Sqo@batyr.db.elephantsql.com/zzljckrb";
            var uri = new Uri(uriString);
            var db = uri.AbsolutePath.Trim('/');
            var user = uri.UserInfo.Split(':')[0];
            var passwd = uri.UserInfo.Split(':')[1];
            var port = uri.Port > 0 ? uri.Port : 5432;
            var connStr = string.Format("Server={0};Database={1};User Id={2};Password={3};Port={4}",
                uri.Host, db, user, passwd, port);

            optionsBuilder.UseNpgsql(connStr);
        }
    }
}
