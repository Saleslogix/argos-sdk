function connection(updateConnection$) {
  return updateConnection$
    .distinctUntilChanged();
}

export { connection };
