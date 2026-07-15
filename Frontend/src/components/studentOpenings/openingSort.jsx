export default function OpeningSort({ value, onChange }) {
  return (
    <label className="block">
      <span className="form-label">Sort</span>
      <select className="form-input" value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="latest">Latest</option>
        <option value="salaryHigh">Salary high to low</option>
        <option value="salaryLow">Salary low to high</option>
        <option value="company">Company</option>
        <option value="role">Role</option>
      </select>
    </label>
  );
}
