const serverAddr = 'http://localhost:3000/api';

const getMenu = async (category) => {
  try {
    const res = await fetch(`${serverAddr}/category/${category}/menu`);
    const result = await res.json();
    if (result.message) throw new Error(result.message)
    return result;
  } catch (err) {
    throw err;
  }
};

const putMenu = async (category, menu) => {
  try {
    const res = await fetch(
      `${serverAddr}/category/${category}/menu/${menu.id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: menu.name,
        }),
      }
    );
    const result = await res.json();
    if (result.message) throw new Error(result.message)
    return result;
  } catch (err) {
    throw err;
  }
};

const putSoldout = async (category, menu) => {
  try {
    const res = await fetch(
      `${serverAddr}/category/${category}/menu/${menu.id}/soldout`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: menu.name,
        }),
      }
    );
    const result = await res.json();
    if (result.message) throw new Error(result.message)
    return result;
  } catch (err) {
    throw err;
  }
};

const deleteMenu = async (category, id) => {
  try {
    const res = await fetch(`${serverAddr}/category/${category}/menu/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await res.json();
    if (result.message) throw new Error(result.message)
  } catch (err) {
    throw err;
  }
};

const postMenu = async (category, name) => {
  try {
    const res = await fetch(`${serverAddr}/category/${category}/menu`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
      }),
    });
    const result = await res.json();
    if (result.message) throw new Error(result.message)
    return result;
  } catch (err) {
    throw err;
  }
};

export { getMenu, putMenu, postMenu, putSoldout, deleteMenu };
