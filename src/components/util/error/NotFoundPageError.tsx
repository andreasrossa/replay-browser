import GenericPageError from "./GenericPageError";

export default function NotFoundPageError() {
  return (
    <GenericPageError>
      <p className="text-sm text-muted-foreground">
        The page you are looking for does not exist.
      </p>
    </GenericPageError>
  );
}
