import api from './api'

export async function getData(url) {
  try {
    const userResponse = await api.get(url);
    return userResponse;
  } catch (err) {
    console.log(err);
    return err;
  }
}

export async function postData(url, data) {
  try {
    const userResponse = await api.post(url, data);
    return userResponse;
  } catch (err) {
    console.log(err);
    return err;
  }
}

export async function patchData(url, data) {
  try {
    const userResponse = await api.patch(url, data);
    return userResponse;
  } catch (err) {
    return err;
  }
}

export async function patchMultiData(url, data) {
  try {
    const userResponse = await api.patch(url, data);
    return userResponse;
  } catch (err) {
    console.log(err);
    return err;
  }
}

export async function fileUpLoadapi(url, data) {
  try {
    const userResponse = await api.post(url, data);
    return userResponse;
  } catch (err) {
    return err;
  }
}

export async function fileUpLoadapiPatch(url, data) {
  try {
    const userResponse = await api.patch(url, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return userResponse;
  } catch (err) {
    return err;
  }
}

export async function deletData(url, data) {
  try {
    const userResponse = await api.delete(url, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return userResponse;
  } catch (err) {
    return err;
  }
}

export async function deletDataByFile(url, data) {
  try {
    const userResponse = await api.delete(url, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return userResponse;
  } catch (err) {
    return err;
  }
}
