exports.EditableCell = ({ initialValue, row, indexRow }) => {
  const [value, setValue] = useState(initialValue);

  const onChange = e => {
    if (e.target.value >= 0) {
      setValue(e.target.value)
    }
  }

  const newData = async () => {
    if (row.number !== value && value >= 0 && value) {
      const patchDataEndPoint = `${apiDomain}/api/${apiVersion}/${requestTo}/${row._id}?page=${pageIndex - 1}`;
      const endPoint = finalEndPoint(patchDataEndPoint);
      await axiosInstance.patch(endPoint, { number: value })
        .then((response) => {
          if (response.data.arrayProduct) {
            setData(response.data.arrayProduct);
            setPageCount(Math.ceil(response.data.totalProduct / pageSize));
          } else {
            let newData = data;
            newData[indexRow] = response.data;
            setData(newData);
          }
        });
    }
  }
  return <input type="number" min="0" value={value} onChange={onChange} onClick={newData} onKeyUp={newData} />
}