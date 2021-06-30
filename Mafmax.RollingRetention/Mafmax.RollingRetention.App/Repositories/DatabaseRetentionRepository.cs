using Mafmax.RollingRetention.App.Context;
using Mafmax.RollingRetention.App.Context.DTOs;
using Mafmax.RollingRetention.App.Context.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mafmax.RollingRetention.App.Repositories
{
    public class DatabaseRetentionRepository : IUsersRetentionRepository
    {

        public DatabaseRetentionRepository()
        {
        }
        public RollingRetentionContext Context { get; }

        public IEnumerable<UserRetentionDto> GetUsersRetention()
        {
            using (var context = new RollingRetentionContext())
            {
                return context.Users.Select(x => new UserRetentionDto(x)).ToList();
            }
        }

        public void SaveUserRetention(IEnumerable<UserRetentionDto> users)
        {
            using (var context = new RollingRetentionContext())
            {
                context.Users.RemoveRange(context.Users);
                context.Users.AddRange(users.Select(x => x.GetUser()));
                context.SaveChanges();
            }
        }
    }
}
