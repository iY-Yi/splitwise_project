module.exports = {
  // This function needs to return a promise
  sum: async (a, b) => {
      return a + b;
  },

  getActivity:  async (userId) => {
    try {
      let groups = await User.findById(userId, 'groups').populate('groups', 'name');
      groups = groups.groups;
      const groupNames = groups.map((group) => group.name);
      const groupIds = groups.map((group) => group._id);

      const activities = await Expense.find({ group: { $in: groupIds } })
        .populate('group', 'name').populate('payor', 'name').sort('-date');
      res.status(200).send({
        activities,
        groups: groupNames,
      });
    } catch (e) {
      res.status(400).send({ error: 'LOAD_ACTIVITY_FAIL' });
    }
  },
}

module.exports = {

}